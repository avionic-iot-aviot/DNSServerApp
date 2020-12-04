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
        let temp: ILeases;
        let data = fs.readFileSync('/var/lib/misc/dnsmasq.leases', 'utf8');
        //console.log('Leases', data);
        let splitted1 = data.split("\n");
        for (let i in splitted1) {
            let splitted2 = splitted1[i].split(" ");
            if (splitted2.length === 5) {
                temp = { timestamp: splitted2[0], mac: splitted2[1], ip: splitted2[2], host: splitted2[3], id: splitted2[4] };
                leases_file.push(temp)
            }
        }
        console.log(leases_file)
        if (db){
            await this.SendPostToDb(leases_file)
            return leases_file
        } else{
            return leases_file
        }

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