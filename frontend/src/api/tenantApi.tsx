import * as _ from 'lodash';
import api from './api';
import BBPromise from 'bluebird';
import { IPaginationOpts } from '../../interfaces/rest';
import { ITenant } from '../../interfaces/tenant';

class TenantsApi extends api {

    create(tenant: ITenant) {
        return new BBPromise((resolve, reject) => {
            const url = '/api/private/tenant/create';
            let params = tenant;
            this.getClient(axiosClient => {
                axiosClient.post(url, params)
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        resolve(error);
                    });
            }, null, false);
        });
    }

    update(tenant: ITenant) {
        return new BBPromise((resolve, reject) => {
            const url = '/api/private/tenant/update';
            let params = tenant;
            this.getClient(axiosClient => {
                axiosClient.put(url, params)
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
            const url = '/api/private/tenant/getAll';
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

    async delete(tenant_id: number): BBPromise<any> {
        return new BBPromise((resolve, reject) => {
            const url = '/api/private/tenant/delete';
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

const treatmentsApi = new TenantsApi();
export default treatmentsApi;
