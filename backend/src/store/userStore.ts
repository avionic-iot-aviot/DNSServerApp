import { IUser } from '../interfaces/interfaces';
const _ = require('lodash');
const moment = require('moment');
var config = require('../../../backend/knexfile');
var knex = require('knex')(config[process.env.NODE_ENV]);

import AuthHelper from './../shared/authHelper';
const authHelper = new AuthHelper();

export default class UserStore {
    constructor() { }

    create(user: IUser) {
        const passwordHashed = authHelper.generateHash(user.password);
        user.password = passwordHashed;
        return knex('users').insert(user).returning('*');
    }

    update(user: IUser) {
        const date = new Date(moment().format()).toISOString();
        user.updated_at = date;
        return knex('users').where({ id: user.id }).update(user).returning('*');
    }


    delete(id: number) {
        return knex('users').where({ id }).del();
    }

    findBy(user: IUser, without_password: boolean = true): any {
        if (without_password) {
            return knex('users').select(['id', 'name', 'created_at', 'updated_at']).where(user);
        } else {
            return knex('users').where(user);
        }
    }

    findById(id: number): any {
        return knex('users').select(['id', 'name', 'created_at', 'updated_at']).where({ id });
    }

    findUser(id: number): any {
        return knex('users').where({ id }).returning('*');
    }
}
