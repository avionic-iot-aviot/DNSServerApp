const arp1 = require('arp-a');
const cfg = require('config');
const equal = require('deep-equal');
const fs = require('fs');
import { Utilities } from '../shared/utilities';
import _ = require('lodash');
import { ILeases } from "../interfaces/interfaces";



export default class LeasesServices {
    async leasesServices(db: boolean) {
        let leases_file: ILeases[] = new Array();
        let lease: ILeases;
        let data = fs.readFileSync('/var/lib/misc/dnsmasq.leases', 'utf8');
        //console.log('Leases', data);
        let splitted1 = data.split("\n");
        for (let i in splitted1) {
            let splitted2 = splitted1[i].split(" ");
            if (splitted2.length === 5) {
                lease = { timestamp: splitted2[0], mac: splitted2[1], ip: splitted2[2], host: splitted2[3], id: splitted2[4] };
                leases_file.push(lease);
            }
        }
        console.log("Lease file content: ", leases_file);
        if (db){
            const lease_ips: string[] = _.map(leases_file, (lease) => lease.ip);
            this.removeN2NHostDirsFiles(lease_ips);
            await this.SendPostToDb(leases_file);
            return leases_file
        } else{
            return leases_file
        }
    }

    // We create the list of files we have in the n2n_hosts_dir and we delete
    // the ones which their name (which is an ip) do not appear in the lease file.
    removeN2NHostDirsFiles(lease_ips: string[]) {
        const n2nHostDir = "/root/n2n_hosts_dir";
        const files_list = []; //files' names are ips
        fs.readdirSync(n2nHostDir, {withFileTypes: true}).forEach(host_file => {
            const first_letter_parsed_as_Int = _.parseInt(host_file.name[0]);
            // We check that it is not a NaN because we want to delete only files having
            // their name to start with a number.
            if(!host_file.isDirectory() && !_.isNaN(first_letter_parsed_as_Int)) {
                files_list.push(host_file.name);
            }
        });
        const files_to_be_deleted: string[] = _.difference(files_list, lease_ips);
        _.each(files_to_be_deleted, (file_name: string) => {
            fs.unlinkSync(`${n2nHostDir}/${file_name}`);
        })
    }

    async SendPostToDb(data:any) {
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
}