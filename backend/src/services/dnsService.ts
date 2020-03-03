import _ = require('lodash');
import { ILease, IDevice, ITenant } from '../interfaces/interfaces';
const cfg = require('config');
const fs = require('fs');
const leases = require('dnsmasq-leases');
const path = require('path');
import DeviceStore from '../store/deviceStore';
import TenantStore from '../store/tenantStore';
const deviceStore = new DeviceStore();
const tenantStore = new TenantStore();

export default class DNSService {

    async searchAndSaveNewLeases() {
        try {
            let prepareFileHost = "";
            let tenantRes = await tenantStore.findBy({ edge_interface_name: cfg.default_tenant });
            if (tenantRes && tenantRes.length == 1) {
                const tenant: ITenant = tenantRes[0];
                let leasesData = this.getCurrentLeases();
                if (leasesData) {
                    for (let i = 0; i < leasesData.length; i++) {
                        const val = leasesData[i];
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
                            let dns_name = devicePersistent.dns_name_manual && devicePersistent.dns_name_manual != "" ? devicePersistent.dns_name_manual : devicePersistent.dns_name_auto;
                            prepareFileHost = prepareFileHost + `${val.ip} ${dns_name}\n`;
                        }
                    }
                }
            }
            console.log("ContentFileHost", prepareFileHost);
            let pathFileHost = cfg.path_file_host ? cfg.path_file_host : "myhostfile";
            this.writeFileHost(pathFileHost, prepareFileHost);
        } catch (error) {
            console.log("ERROR", error);
        }
    }

    getCurrentLeases() {
        try {
            let tmpDirectoryLeases = cfg.watcher && cfg.watcher.leases_path ? cfg.watcher.leases_path : path.join(__dirname, '../../src/leases');
            let leasesData = [];
            let data = fs.readFileSync(tmpDirectoryLeases, 'utf8');
            if (data) {
                leasesData = leases(data);
            }
            return leasesData;
        } catch (error) {
            console.log("ERROR", error);
            return null;
        }
    }

    writeFileHost(filename: string, content: string) {
        fs.writeFile(filename, content, function (err: any) {
            if (err) console.log(err);
            else console.log("file saved");
        });
    }
}