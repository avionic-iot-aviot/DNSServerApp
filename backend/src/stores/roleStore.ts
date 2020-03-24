import { IRole } from '../interfaces/interfaces';
const _ = require('lodash');
var config = require('../../../backend/knexfile');
var knex = require('knex')(config[process.env.NODE_ENV]);

export default class RoleStore {
    constructor() { }


    create(role: IRole) {
        return knex('roles').insert(role).returning('*');
    }

    update(role: IRole) {
        return knex('roles').insert(role).returning('*');
    }

    findBy(role: IRole) {
        return knex('roles').where(role);
    }

    delete(id: number) {
        return knex('roles').where({ id }).del();
    }
}