
const arp1 = require('arp-a');
const cfg = require('config');
import { Utilities } from '../shared/utilities';
import _ = require('lodash');

export default class PingService {

    async execute() {
        try {
            const arpData = await this.getElementsFromArpTable();
            console.log("arpData", arpData);
            if (arpData) {
                this.contactGW(arpData);
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    // il metodo scansiona la tabella degli ARP
    // seleziona le righe relative all'interfaccia indicata nel file di configurazione
    // ritorna una mappa contenente MAC addresses e IPs
    async getElementsFromArpTable() {
        try {
            const promise = new Promise((resolve, reject) => {
                let tbl: any = { mac_addresses: {} };

                arp1.table(function (err: any, entry: any) {
                    if (!!err) return console.log('arp: ' + err.message);
                    if (!entry) return;
                    // if (entry.ifname == cfg.arp.interface) {
                    if (entry && entry[cfg.arp.entry_interface] && entry[cfg.arp.entry_interface] == cfg.arp.interface) {

                        if (tbl.mac_addresses[entry.mac]) {
                            if (!tbl.mac_addresses[entry.mac].includes(entry.ip)) {
                                tbl.mac_addresses[entry.mac].push(entry.ip);
                            }
                        } else {
                            tbl.mac_addresses[entry.mac] = [entry.ip];
                        }
                    }
                    resolve(tbl);

                });
            });
            return promise;
        } catch (error) {
            console.log("ERRR", error);
        }
    }

    // data la mappa contenenet tutti gli IP raggruppati per MAC Address
    // si proverà a fare una richiesta su ogni IP, al fine di inviare all'indirizzo del GW
    // che sta in ascolto tutti gli IP che afferiscono allo stesso MAC address
    async contactGW(table: any) {
        try {
            if (table && table.mac_addresses && Object.keys(table.mac_addresses).length > 0) {
                await Object.keys(table.mac_addresses).forEach(async (key: string) => {
                    const ipaddrs: string[] = table.mac_addresses[key];
                    if (ipaddrs.length > 1) {
                        await ipaddrs.forEach(async (ip: string) => {
                            let upaddrsToSend = ipaddrs.slice(0);
                            _.remove(upaddrsToSend, (n: string) => {
                                return n == ip
                            });
                            let request_data = {
                                url: `http://${ip}:3800/ping`,
                                method: 'POST',
                                body: {
                                    params: {
                                        ips: upaddrsToSend
                                    }
                                },
                                json: true
                            };
                            await Utilities.request(request_data);
                        });
                    }
                });
            }
        } catch (error) {
            console.log("ERROR contact GW", error);
        }
    }
}