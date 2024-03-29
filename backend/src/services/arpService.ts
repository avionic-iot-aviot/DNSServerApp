const arp1 = require('arp-a');
const cfg = require('config');
const equal = require('deep-equal');
const fs = require('fs');
import { Utilities } from '../shared/utilities';
import _ = require('lodash');

export default class PingService {

    async execute() {
        try {
            const arpData = await this.getElementsFromArpTable();
            console.log("arpData", arpData);
            console.log("PING: Check ARP table -->", arpData)
            if (arpData) {
                const comparation = await this.compareOldAndNewObject(arpData);
                console.log("comparation", comparation);
                await this.saveObjectInFile(JSON.stringify(arpData));
                console.log("PING: Check if it has been changed -->", comparation);
                this.contactGW(arpData); // lo fa sempre
                /*if (!comparation) {
                    console.log("PING: Send to the Gateway")
                    this.contactGW(arpData);
                }*/
                await this.updateCopterID(arpData['mac_addresses']);
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    saveObjectInFile(content: string) {
        try {
            fs.writeFileSync("arp_object", content);
            console.log("saveObjectInFile: file saved");
        } catch (err) {
            console.log("Error in saveObjectInFile: ", err);
        }
    }

    async getObjectFromFile() {
        try {
            if (fs.existsSync("arp_object")) {
                const content = await fs.readFileSync("arp_object", 'utf8');
                console.log("content", content);
                return content;
            }

        } catch (error) {
            console.log("ERRR", error);
        }
    }

    async compareOldAndNewObject(newObject: any) {
        let areEqual = false;
        const oldObjectStringified = await this.getObjectFromFile();
        if (oldObjectStringified) {
            console.log("oldObjectStringified", oldObjectStringified);
            console.log("newObjectStringified", JSON.stringify(newObject));

            // equal = Object.is(newObjectStringified, oldObjectStringified)
            const oldObject = JSON.parse(oldObjectStringified);
            areEqual = await equal(newObject, oldObject);
        }
        return areEqual;
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
                for (let mac_address in table.mac_addresses) {
                    let ipaddrs = table.mac_addresses[mac_address];
                    if (ipaddrs.length > 1) {
                        await Promise.all(_.each(ipaddrs, (receiverIp: string) => {
                            let ipaddrsToSend = _.filter(ipaddrs, (ip: string) => ip != receiverIp);
                            console.log("PING: I'll contact -->", `http://${receiverIp}:${cfg.general.portGwApp}/ping`);
                            console.log("PING: sent to -->", ipaddrsToSend);
                            let request_data = {
                                url: `http://${receiverIp}:${cfg.general.portGwApp}/ping`,
                                method: 'POST',
                                body: {
                                    params: {
                                        ips: ipaddrsToSend
                                    }
                                },
                                json: true
                            };
                            Utilities.request(request_data);
                        }));
                    }
                }
            }
        } catch (error) {
            console.log("ERROR contact GW", error);
        }
    }

    /**
     * This method will be used to send the mac_addresses found inside the arp table to the DBApp.
     * If needed the DBApp will update copterIDs for the devices.
     * @param mac_addresses 
     */
    async updateCopterID(mac_addresses) {
        var drones_mac_addresses = {}
        for (let mac in mac_addresses) {
            if (mac_addresses[mac].length > 1) {
                drones_mac_addresses[mac] = mac_addresses[mac];
            }
        }
        if (Object.keys(drones_mac_addresses).length > 0) {
            let request_data = {
                url: `http://${cfg.general.ipBackend}:${cfg.general.portBackend}/leases/refreshCopterIDs`,
                method: 'POST',
                body: {
                    params: drones_mac_addresses
                },
                json: true
            };
            await Utilities.request(request_data);
        }
    }
}
