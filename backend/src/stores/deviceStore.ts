import { IDevice } from '../interfaces/interfaces';
const _ = require('lodash');
const moment = require('moment');
var config = require('../../../backend/knexfile');
var knex = require('knex')(config[process.env.NODE_ENV]);

export default class DeviceStore {
    constructor() { }

    create(device: IDevice) {
        return knex('devices').insert(device).returning('*');
    }

    update(device: IDevice) {
        const date = new Date(moment().format()).toISOString();
        device.updated_at = date;
        return knex('devices').where({ id: device.id }).update(device).returning('*');
    }

    delete(id: number) {
        return knex('devices').where({ id }).del();
    }

    findById(id: number): any {
        return knex('devices').select('*').where({ id });
    }

    findBy(device: IDevice): any {
        return knex('devices').where(device).returning('*');
    }

    findAll() {
        return knex('devices').returning('*');
    }
}