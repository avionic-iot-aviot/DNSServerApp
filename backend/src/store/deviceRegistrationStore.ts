import { IDeviceRegistration } from '../interfaces/interfaces';
const _ = require('lodash');
const moment = require('moment');
var config = require('../../../backend/knexfile');
var knex = require('knex')(config[process.env.NODE_ENV]);

export default class DeviceRegistrationStore {
    constructor() { }

    create(device_registration: IDeviceRegistration) {
        return knex('device_registrations').insert(device_registration).returning('*');
    }

    update(device_registration: IDeviceRegistration) {
        const date = new Date(moment().format()).toISOString();
        device_registration.updated_at = date;
        return knex('device_registrations').where({ id: device_registration.id }).update(device_registration).returning('*');
    }

    delete(id: number) {
        return knex('device_registrations').where({ id }).del();
    }

    findById(id: number): any {
        return knex('device_registrations').select('*').where({ id });
    }

    findBy(device_registration: IDeviceRegistration): any {
        return knex('device_registrations').where(device_registration).returning('*');
    }

    findAll() {
        return knex('device_registrations').returning('*');
    }
}