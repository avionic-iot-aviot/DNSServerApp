import * as _ from 'lodash';
import api from './api';
import BBPromise from 'bluebird';
import { IPaginationOpts } from '../../interfaces/rest';
import { IDevice } from '../../interfaces/device';

class DevicesApi extends api {

    create(device: IDevice) {
        return new BBPromise((resolve, reject) => {
            const url = '/api/private/device/create';
            let params = device;
            this.getClient(axiosClient => {
                axiosClient.post(url, { params })
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        resolve(error);
                    });
            }, null, false);
        });
    }

    update(device: IDevice) {
        return new BBPromise((resolve, reject) => {
            const url = '/api/private/device/update';
            let params = device;
            this.getClient(axiosClient => {
                axiosClient.put(url, { params })
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        resolve(error);
                    });
            }, null, false);
        });
    }

    getAll(options?: IPaginationOpts, search?: string) {
        return new BBPromise((resolve, reject) => {
            const url = '/api/private/device/getAll';
            let params: any = {};
            if (options) {
                params = { options };
            }
            if (search) {
                params.search = search
            }
            this.getClient(axiosClient => {
                axiosClient.get(url, { params })
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        resolve(error);
                    });
            }, null, false);
        });
    }

    getById(device_id: number) {
        return new BBPromise((resolve, reject) => {
            const url = '/api/private/device';
            let params: any = { id: device_id };

            this.getClient(axiosClient => {
                axiosClient.get(url, { params })
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        resolve(error);
                    });
            }, null, false);
        });
    }

    async delete(tenant_id: number): BBPromise<any> {
        return new BBPromise((resolve, reject) => {
            const url = '/api/private/device/delete';
            const params = { id: tenant_id };
            this.getClient(axiosClient => {
                axiosClient.delete(url, { params })
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        resolve(error);
                    });
            });
        });
    }
}

const devicesApi = new DevicesApi();
export default devicesApi;
