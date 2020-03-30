const cfg = require('config');
const path = require('path');
const dotenv = require('dotenv');
const envFilename = path.join(
    __dirname,
    '../../env/',
    cfg.env.envFilename
);
dotenv.config({ path: envFilename });

import RoleStore from '../stores/roleStore';
import TenantStore from '../stores/tenantStore';

import UserStore from '../stores/userStore';
import { role } from '../shared/constants';
import { IRole, IUser, ITenant } from '../interfaces/interfaces';
const roleStore = new RoleStore();
const tenantStore = new TenantStore();
const userStore = new UserStore();

export default class InsertDataSeedsService {

    async addRoles() {
        try {
            let rolesObject = role;
            const rolesValue = Object.values(role);
            console.log("rolesObject", rolesObject);
            console.log("rolesValue", rolesValue);

            for (let i = 0; i < rolesValue.length; i++) {
                const roleObject: IRole = {
                    name: rolesValue[i]
                };
                const roleRes = await roleStore.findBy(roleObject);
                console.log("roleRes", roleRes);

                if (roleRes && roleRes.length == 0) {
                    await roleStore.create(roleObject);
                }
            }
        } catch (error) {
            console.log("ERROR addRoles", error);
        }
    }

    async addUserSuperAdmin() {
        try {
            const roleObject: IRole = {
                name: role.SUPER_ADMIN
            };
            const roleRes = await roleStore.findBy(roleObject);
            console.log("addUserSuperAdmin", roleRes);

            if (roleRes && roleRes.length == 1) {
                const user: IUser = {
                    username: process.env.USERNAME_SUPER_ADMIN
                };

                const userRes = await userStore.findBy(user);
                console.log("userRes", userRes);
                if (userRes && userRes.length == 0) {
                    user.role_id = roleRes[0].id,
                        user.email = process.env.EMAIL_SUPER_ADMIN,
                        user.password = process.env.PASSWORD_SUPER_ADMIN;
                    await userStore.create(user);
                }
            }
        } catch (error) {
            console.log("ERROR addUserSuperAdmin", error);
        }

    }

    async addTenant() {
        try {
            const tenant: ITenant = {
                edge_interface_name: cfg.default_tenant
            }
            const tenantRes = tenantStore.findBy(tenant);
            if (tenantRes && tenantRes.length == 0) {
                await tenantStore.create(tenant);
            }
        } catch (error) {

        }
    }

}