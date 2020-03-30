
const arp1 = require('arp-a');
const cfg = require('config');
const equal = require('deep-equal');
const fs = require('fs');
import { Utilities } from '../shared/utilities';
import _ = require('lodash');
import TenantStore from '../stores/tenantStore';
const tenantStore = new TenantStore();
import { ITenant, ILease, IDevice } from '../interfaces/interfaces';
import DNSService from './dnsService';
const dnsService = new DNSService();
import DeviceStore from '../stores/deviceStore';
const deviceStore = new DeviceStore();

export default class PingService {

    async execute() {
        try {
            // recupero dati dall'arpTable
            const arpData = await this.getElementsFromArpTable();
            console.log("arpData", arpData);
            if (arpData) {
                // verifica se i dati dell'arpTable sono identici a quelli precedenti
                const comparation = await this.compareOldAndNewObject(arpData);
                console.log("comparation", comparation);
                // salvataggio nuovi dati dell'arpTable, necessari per la comparazione al successivo ciclo di esecuzione 
                Utilities.writeFile(cfg.arp.check_file, JSON.stringify(arpData));
                // se i dati dell'arp table sono cambiati verranno effettuate delle operazioni
                if (!comparation) {
                    // verranno inviati gli Ip degli hosts ai gateway
                    // il metodo ritornerà i dati dei gateway a cui è stato possibile effettuare la richiesta (i gateway vivi)
                    const contactedGW = this.contactGW(arpData);
                    if (contactedGW) {
                        const gwMacs = contactedGW;
                        // inserimento informazioni dei Gateway e degli hosts nella tabella devices
                        this.addInfoGWAndTenantToDevices(arpData, gwMacs);
                    }
                }
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    async addInfoGWAndTenantToDevices(arpData: any, contactedGW: any) {
        // MAC address dei gateway che sono stati contattati
        const gwMacs = Object.keys(contactedGW);
        const leases = Utilities.getCurrentLeases();
        if (arpData) {
            await Object.keys(arpData).forEach(async (interfaceKey: string) => {
                console.log("interfaceKey", interfaceKey);
                const mac_addresses = arpData[interfaceKey].mac_addresses;
                if (mac_addresses && Object.keys(mac_addresses).length > 0) {
                    let tenantRes = await tenantStore.findBy({ edge_interface_name: interfaceKey });
                    if (tenantRes && tenantRes.length == 1) {
                        const tenant = tenantRes[0];
                        console.log("tenant", tenant);

                        let currentGWId: number = null;
                        await Object.keys(mac_addresses).forEach(async (key: string) => {
                            console.log("mac_address", key);

                            if (gwMacs.includes(key)) {
                                let gwInterface: IDevice = {
                                    mac_address: key,
                                    tenant_id: tenant.id
                                };
                                console.log("gwInterface Device", gwInterface);

                                const gwRes = await deviceStore.findBy(gwInterface);
                                gwInterface.is_gw = true;
                                // aggiunge o aggiorna il gateway nell DB (tabella devices)
                                if (gwRes && gwRes.length == 1) {
                                    gwInterface.id = gwRes[0].id;
                                    // verificare result update
                                    const updateRes = await deviceStore.update(gwInterface);
                                    if (updateRes) {
                                        currentGWId = updateRes[0];
                                    }
                                    // currentGW = gwRes[0];
                                } else {
                                    // verificare result create
                                    const createRes = await deviceStore.create(gwInterface);
                                    console.log("createRes", createRes);
                                    if (createRes) {
                                        currentGWId = createRes[0];
                                    }
                                }
                                return;
                                // }
                                const ipaddrs: string[] = mac_addresses[key];
                                await ipaddrs.forEach(async (ip: string) => {
                                    // se IP non è quello del Gateway
                                    if (ip != contactedGW[key]) {
                                        const currentLeases = leases.filter((val: ILease) => val.ip == ip);
                                        if (currentLeases && currentLeases.length == 1) {
                                            const currentLease: ILease = currentLeases[0];
                                            let device: IDevice = {
                                                mac_address: currentLease.mac,
                                                tenant_id: tenant.id
                                            };
                                            const deviceRes = await deviceStore.findBy(device);
                                            device.is_gw = false;
                                            device.gw_id = currentGWId;
                                            if (deviceRes && deviceRes.length == 1) {
                                                device.id = deviceRes[0].id;
                                                await deviceStore.update(device);
                                            } else {
                                                await deviceStore.create(device);
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    }
// recupero dati dell'arp table storati in un file
    async getObjectFromFile() {
        try {
            if (fs.existsSync(cfg.arp.check_file)) {
                const content = await fs.readFileSync(cfg.arp.check_file, 'utf8');
                console.log("content", content);
                return content;
            }

        } catch (error) {
            console.log("ERRR", error);
        }
    }

    // comparazione vecchi dati dell'arp table con i nuovi dati
    async compareOldAndNewObject(newObject: any) {
        let areEqual: boolean = false;
        const oldObjectStringified = await this.getObjectFromFile();
        if (oldObjectStringified) {
            console.log("oldObjectStringified", oldObjectStringified);
            console.log("newObjectStringified", JSON.stringify(newObject));

            // equal = Object.is(newObjectStringified, oldObjectStringified)
            const oldObject = JSON.parse(oldObjectStringified);
            areEqual = equal(newObject, oldObject);
        }
        return areEqual;
    }

    // il metodo scansiona la tabella degli ARP
    // seleziona le righe relative alle interfacce relative ai vari tenants
    // ritorna una mappa contenente interfaces, MAC addresses e IPs
    async getElementsFromArpTable() {
        try {
            const tenants = await tenantStore.findAll();
            if (tenants) {
                const tenantInterfaces = tenants.map((val: ITenant) => val.edge_interface_name);
                // const tenantInterfaces: string[] = [cfg.arp.interface];
                const promise = new Promise((resolve, reject) => {
                    let tbl: any = {};

                    arp1.table(function (err: any, entry: any) {
                        if (!!err) return console.log('arp: ' + err.message);
                        if (!entry) return;
                        // console.log("(entry[cfg.arp.entry_interface]", (entry[cfg.arp.entry_interface]);

                        if (entry && entry[cfg.arp.entry_interface] && tenantInterfaces.includes(entry[cfg.arp.entry_interface])) {
                            if (!tbl[entry[cfg.arp.entry_interface]]) tbl[entry[cfg.arp.entry_interface]] = { mac_addresses: {} };
                            if (tbl[entry[cfg.arp.entry_interface]].mac_addresses[entry.mac]) {
                                tbl[entry[cfg.arp.entry_interface]].mac_addresses[entry.mac].push(entry.ip);
                            } else {
                                tbl[entry[cfg.arp.entry_interface]].mac_addresses[entry.mac] = [entry.ip];
                            }
                        }
                        resolve(tbl);

                    });
                });
                return promise;
            }
        } catch (error) {
            console.log("ERRR", error);
        }
    }

    // data la mappa contenenet tutti gli IP raggruppati per MAC Address
    // si proverà a fare una richiesta su ogni IP, al fine di inviare all'indirizzo del GW
    // che sta in ascolto tutti gli IP che afferiscono allo stesso MAC address
    async contactGW(table: any) {
        try {
            let contacted: any = {};
            if (table) {
                await Object.keys(table).forEach(async (interfaceKey: string) => {
                    const mac_addresses = table[interfaceKey].mac_addresses;
                    if (mac_addresses && Object.keys(mac_addresses).length > 0) {
                        await Object.keys(mac_addresses).forEach(async (key: string) => {
                            const ipaddrs: string[] = mac_addresses[key];
                            // if (ipaddrs.length > 1) {
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
                                const requestRes = await Utilities.request(request_data);
                                if (requestRes && requestRes.success) {
                                    contacted[key] = ip;
                                }
                            });
                            // }
                        });
                    }
                });
            }
            return contacted;
        } catch (error) {
            console.log("ERROR contact GW", error);
        }
    }
}