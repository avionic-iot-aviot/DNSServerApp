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
    // collegati al GW. Il file viene cancellato e ricreato ex-novo ogni volta a partire dal contenuto delle leases,
    // arricchite con il dns_name_manual preso dal DB
    async searchAndSaveNewLeases() {
        try {
            let prepareFileHost = "";
            // const tenantRes = await tenantStore.findAll();
            let tenantRes = await tenantStore.findBy({ edge_interface_name: cfg.default_tenant });

            if (tenantRes && tenantRes.length > 0) {
                let leasesData = Utilities.getCurrentLeases();
                // for (let i = 0; i < tenantRes.length; i++) {
                // const tenant: ITenant = tenantRes[i];
                const tenant: ITenant = tenantRes[0];
                if (leasesData) {
                    for (let j = 0; j < leasesData.length; j++) {
                        const val = leasesData[j];
                        let device: IDevice = {
                            mac_address: val.mac,
                            tenant_id: tenant.id
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
                            // dns_name è uguale = al nome DNS inserito dall'utente mediante il form (se esiste)
                            // altrimenti è uguale al nome DNS presente nel file delle leases la prima volta che il record viene aggiunto tra le leases
                            let dns_name = devicePersistent.dns_name_manual && devicePersistent.dns_name_manual != "" ? devicePersistent.dns_name_manual : devicePersistent.dns_name_auto;
                            prepareFileHost = prepareFileHost + `${val.ip} ${dns_name}\n`;
                        }
                    }
                }
                // }
            }
            console.log("ContentFileHost", prepareFileHost);
            let pathFileHost = cfg.path_file_host ? cfg.path_file_host : "myhostfile";
            Utilities.writeFile(pathFileHost, prepareFileHost);
        } catch (error) {
            console.log("ERROR", error);
        }
    }
}