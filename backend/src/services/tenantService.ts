import _ = require('lodash');
import { ILease, IDevice, ITenant } from '../interfaces/interfaces';
const cfg = require('config');
const fs = require('fs');
const leases = require('dnsmasq-leases');
const path = require('path');
import TenantStore from '../store/tenantStore';
const tenantStore = new TenantStore();

export default class TenantService {

    

}