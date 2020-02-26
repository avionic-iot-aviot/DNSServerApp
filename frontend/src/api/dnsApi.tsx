import * as _ from 'lodash';
import api from './api';
import BBPromise from 'bluebird';
import { IDNS } from '../../interfaces/dns';

class DNSApi extends api {
    addElement(data: IDNS) {
        return new BBPromise((resolve, reject) => {
            const url = '/dns/add';
            const params = data;
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
}

const dnsAPI = new DNSApi();
export default dnsAPI;
