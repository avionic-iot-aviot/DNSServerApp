
const arp1 = require('arp-a');
const cfg = require('config');
import { Utilities } from '../shared/utilities';

export default class PingService {

    async execute() {
        try {
            const arpData = await this.getElementsFromArpTable();
            if (arpData) {
                this.contactGW(arpData);
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    async getElementsFromArpTable() {

        try {
            const promise = new Promise((resolve, reject) => {
                let tbl: any = { mac_addresses: {} };

                arp1.table(function (err: any, entry: any) {
                    if (!!err) return console.log('arp: ' + err.message);
                    if (!entry) return;
                    if (entry.ifname == cfg.arp.interface) {
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

    async contactGW(table: any) {
        try {
            if (table && table.mac_addresses && Object.keys(table.mac_addresses).length > 0) {
                await Object.keys(table.mac_addresses).forEach(async (key: string) => {
                    const ipaddrs: string[] = table.mac_addresses[key];
                    await ipaddrs.forEach(async (ip: string) => {
                        let request_data = {
                            url: `${ip}/ping`,
                            method: 'POST',
                            body: {
                                params: {
                                    ips: ipaddrs
                                }
                            }
                        };
                        await Utilities.request(request_data);
                    });
                });
            }

        } catch (error) {
            console.log("ERROR contact GW", error);
        }

    }
}