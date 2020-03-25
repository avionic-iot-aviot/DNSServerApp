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
import UserStore from '../stores/userStore';
import { role } from '../shared/constants';
import { IRole, IUser } from '../interfaces/interfaces';
const roleStore = new RoleStore();
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
                    role_id: roleRes[0].id,
                    email: process.env.EMAIL_SUPER_ADMIN
                };
                console.log("user addUserSuperAdmin", user);

                const userRes = await userStore.findBy(user);
                console.log("userRes", userRes);
                if (userRes && userRes.length == 0) {
                    user.password = process.env.PASSWORD_SUPER_ADMIN; await userStore.create(user);

                }
            }
        } catch (error) {
            console.log("ERROR addUserSuperAdmin", error);
        }

    }

}