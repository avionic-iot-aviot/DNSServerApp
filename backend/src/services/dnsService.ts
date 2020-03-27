import _ = require('lodash');
import { ILease, IDevice, ITenant } from '../interfaces/interfaces';
const cfg = require('config');
import DeviceStore from '../stores/deviceStore';
import TenantStore from '../stores/tenantStore';
import { Utilities } from '../shared/utilities';
const deviceStore = new DeviceStore();
const tenantStore = new TenantStore();

export default class DNSService {

    // il metodo aggiunge nella tabella devices tutti i nuovi MAC_address presenti nel file delle leases
    // e crea il file host che servirà a dnsmasq per poter risolvere gli hostname dei GW e degli hosts 
    // collegati al GW
    async searchAndSaveNewLeases() {
        try {
            let prepareFileHost = "";
            // const tenantRes = await tenantStore.findAll();
            // let tenantRes = await tenantStore.findBy({ edge_interface_name: cfg.default_tenant });

            // if (tenantRes) {
            let leasesData = Utilities.getCurrentLeases();
            // for (let i = 0; i < tenantRes.length; i++) {
            //     const tenant: ITenant = tenantRes[i];
            if (leasesData) {
                for (let j = 0; j < leasesData.length; j++) {
                    const val = leasesData[j];
                    let device: IDevice = {
                        mac_address: val.mac,
                        // tenant_id: tenant.id
                    };

                    const deviceRes = await deviceStore.findBy(device);
                    let devicePersistent = null;
                    if (deviceRes && deviceRes.length == 0) {
                        device.dns_name_auto = val.host || "";
                        await deviceStore.create(device);
                        devicePersistent = device;
                    } else {
                        devicePersistent = deviceRes[0];
                    }
                    if (devicePersistent) {
                        let dns_name = devicePersistent.dns_name_manual && devicePersistent.dns_name_manual != "" ? devicePersistent.dns_name_manual : devicePersistent.dns_name_auto;
                        prepareFileHost = prepareFileHost + `${val.ip} ${dns_name}\n`;
                    }
                }
            }
            // }
            // }
            console.log("ContentFileHost", prepareFileHost);
            let pathFileHost = cfg.path_file_host ? cfg.path_file_host : "myhostfile";
            Utilities.writeFile(pathFileHost, prepareFileHost);
        } catch (error) {
            console.log("ERROR", error);
        }
    }
}