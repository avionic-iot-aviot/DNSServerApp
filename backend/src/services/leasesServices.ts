const arp = require('arp-a');
const cfg = require('config');
const equal = require('deep-equal');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
import { Utilities } from '../shared/utilities';
import _ = require('lodash');
import { ILeases } from "../interfaces/interfaces";



export default class LeasesServices {
    async leasesServices(db: boolean) {
        let leases_file: ILeases[] = this.initializeLeasesArray();
        let lease: ILeases;
        let data = fs.readFileSync('/var/lib/misc/dnsmasq.leases', 'utf8');
        //console.log('Leases', data);
        let splitted1 = data.split("\n");
        for (let i in splitted1) {
            let splitted2 = splitted1[i].split(" ");
            if (splitted2.length === 5) {
                lease = { timestamp: splitted2[0], mac: splitted2[1], ip: splitted2[2], host: splitted2[3], copterID: splitted2[4], isStatic: false, isADevice: true, isActive: true };
                leases_file.push(lease);
            }
        }
        const ips = _.map(leases_file, (lease) => lease.ip);
        const arpData = await this.retrieveArpTableIps();
        const edgeDevices = arpData[cfg.arp.interface]; //this is a JSON having ips as keys and jsons as values
        for (let ip in edgeDevices) { //we are cycling over the keys instead of the values
            if (!_.includes(ips, ip)) {
                lease = { timestamp: `${Date.now() / 1000}`, mac: edgeDevices[ip]['mac'], ip: edgeDevices[ip]['ip'], host: this.getHost(ip), copterID: edgeDevices['mac'], isStatic: true, isADevice: this.isADevice(ip), isActive: true };
                leases_file.push(lease);
            }
        }

        console.log("Lease file content: ", leases_file);
        if (db) {
            const lease_ips: string[] = _.map(leases_file, (lease) => lease.ip);
            await this.removeN2NHostDirsFiles(lease_ips);
            await this.SendPostToDb(leases_file);
            return leases_file;
        } else {
            return leases_file;
        }
    }

    /**
     * This method initialize the leases_file variable. It creates
     * the lease element rappresenting the dnsserverapp and appends it to the leases_file.
     * @returns 
     */
    initializeLeasesArray(): ILeases[] {
        let leases_file: ILeases[] = new Array();

        let dnsmasq_lease: ILeases = {
            id: process.env.MAC_ADDRESS_DNSSERVERAPP.toLowerCase(),
            mac: process.env.MAC_ADDRESS_DNSSERVERAPP.toLowerCase(),
            ip: process.env.N2N_IP_DNSSERVERAPP,
            host: "dhcp-dns-server",
            isStatic: true,
            isADevice: false,
            timestamp: `${Date.now() / 1000}`, 
            isActive: true
        }
        leases_file.push(dnsmasq_lease);

        return leases_file;
    }

    /**
     * Some devices will have a specific hostname (such as mlvpn). Others will get a temp name.
     * This is needed for devices which have a static ip. We don't have their hostnames in the arp table.
     * @param ip 
     */
    getHost(ip: string): string {
        const last_number_of_ip = parseInt(ip.split('.')[3]);
        if (last_number_of_ip <= 20) {
            switch (ip) {
                case process.env.N2N_IP_ROSCORE:
                    return 'roscore';
                case process.env.N2N_IP_JANUS:
                    return 'janus';
                case process.env.N2N_IP_ROSNODEJS:
                    return 'rosnodejs';
                case process.env.N2N_IP_MLVPN:
                    return 'mlvpn';
                default:
                    return `cluster-node-${last_number_of_ip}`;
            }
        }
        return `drone-${last_number_of_ip}`;
    }

    /**
     * Drones have ips with the foruth number higher than 20. ip <= 20 are from cluster (mlvpn and such). 
     * @param ip 
     */
    isADevice(ip: string): boolean {
        const last_number_of_ip = parseInt(ip.split('.')[3]);
        return last_number_of_ip > 20;
    }

    // We create the list of files we have in the n2n_hosts_dir and we delete
    // the ones which their name (which is an ip) do not appear in the lease file.
    async removeN2NHostDirsFiles(lease_ips: string[]) {
        const n2nHostDir = "/root/n2n_hosts_dir";
        const files_list = []; //files' names are ips
        fs.readdirSync(n2nHostDir, { withFileTypes: true }).forEach(host_file => {
            const first_letter_parsed_as_Int = _.parseInt(host_file.name[0]);
            // We check that it is not a NaN because we want to delete only files having
            // their name to start with a number.
            if (!host_file.isDirectory() && !_.isNaN(first_letter_parsed_as_Int)) {
                files_list.push(host_file.name);
            }
        });
        const files_to_be_deleted: string[] = _.difference(files_list, lease_ips);
        if (files_to_be_deleted.length > 0) {
            const { stdout2, stderr2 } = await exec(` /bin/ash -c 'kill -SIGHUP $(pidof dnsmasq)' `);
            console.log('removeN2NHostDirsFiles: stdout:', stdout2);
            console.log('removeN2NHostDirsFiles: stderr:', stderr2);
        }
        _.each(files_to_be_deleted, (file_name: string) => {
            fs.unlinkSync(`${n2nHostDir}/${file_name}`);
        })
    }

    async SendPostToDb(data: any) {
        let request_data = {
            url: `http://${cfg.general.ipBackend}:${cfg.general.portBackend}/leases/refresh`,
            method: 'POST',
            body: {
                params: {
                    leases: data
                }
            },
            json: true
        };
        await Utilities.request(request_data);
        console.log("DnsService - SendPostResponse: Post send! " + `(http://${cfg.general.ipBackend}:${cfg.general.portBackend}/leases/refresh)`)
    }

    /**
     * We read the ARP table to get all the devices in there. It is possible that
     * few devices will have static ips, so we need to read them from the ARP-table
     * @returns 
     */
    async retrieveArpTableIps() {
        try {
            const promise = new Promise((resolve, reject) => {
                let tbl = {};

                arp.table(function (err, entry) {
                    if (!!err) return console.log('arp: ' + err.message);
                    if (!entry) return;

                    if (!tbl[entry.iface]) tbl[entry.iface] = {};
                    tbl[entry.iface][entry.ip] = {
                        mac: entry.mac,
                        ip: entry.ip
                    }
                    resolve(tbl);
                });
            });
            return promise;
        } catch (error) {
            console.log("ERRR", error);
            return null;
        }
    }
}