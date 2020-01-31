const arp1 = require('arp-a');
let tbl: any = { mac_addresses: {} };
const cfg = require('config');
import { Utilities } from '../shared/utilities';


export default class PingService {

    async getElementsFromArpTable() {

        try {
            await arp1.table(function (err: any, entry: any) {
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
            });

        } catch (error) {
            console.log("ERRR", error);
        }
    }

    async contactGW() {
        await tbl.mac_addresses.forEach(async (ipaddrs: string[]) => {
            await ipaddrs.forEach(async (ip: string) => {
                let request_data = {
                    url: `${ip}/ping`,
                    method: 'POST',
                    form: {
                        params: {
                            ips: ipaddrs
                        }
                    }
                };
                await Utilities.request(request_data)
            });
        });
    }
}