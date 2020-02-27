import { ITenant } from '../interfaces/interfaces';
const _ = require('lodash');
const moment = require('moment');
var config = require('../../../backend/knexfile');
var knex = require('knex')(config[process.env.NODE_ENV]);

export default class TenantStore {
    constructor() { }

    create(tenant: TenantStore) {
        return knex('tenants').insert(tenant).returning('*');
    }

    update(tenant: ITenant) {
        const date = new Date(moment().format()).toISOString();
        tenant.updated_at = date;
        return knex('tenants').where({ id: tenant.id }).update(tenant).returning('*');
    }

    delete(id: number) {
        return knex('tenants').where({ id }).del();
    }

    findById(id: number): any {
        return knex('tenants').select('*').where({ id });
    }

    findBy(tenant: ITenant): any {
        return knex('tenants').where(tenant).returning('*');
    }

    findAll() {
        return knex('tenants').returning('*');
    }
}