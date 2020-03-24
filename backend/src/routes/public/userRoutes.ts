import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import AuthHelper from '../../shared/authHelper';
import RoleStore from '../../stores/roleStore';
import UserStore from '../../stores/userStore';
import { IUser } from '../../interfaces/interfaces';
import { role } from '../../shared/constants';

const factory = require('../../shared/factory');
const router = express.Router();

const authHelper = new AuthHelper();
const roleStore = new RoleStore();
const userStore = new UserStore();

declare module 'express' {
    interface Request {
        body: any;
        user_id: any;
    }
}

module.exports = (passport: any) => {

    router.post('/login', (req, res, next) => {
        passport.authenticate('local-login', async (
            err: any,
            account: any,
            info: any
        ) => {
            if (account) {
                const roleRes = await roleStore.findBy({ id: account.role_id });

                if (roleRes && roleRes.length > 0) {
                    const token = authHelper.generateToken(account.id, account.email, roleRes[0].name);
                    const result = factory.generateSuccessResponse(token, null, "Login successfully");
                    res.status(HttpStatus.OK).json(result);
                    res.end();
                } else {
                    const result = factory.generateErrorResponse(null, null, "User not found");
                    res.status(HttpStatus.UNAUTHORIZED).send(result);
                    res.end();
                }

            } else {
                const result = factory.generateErrorResponse(null, null, info.message);
                res.status(HttpStatus.OK).json(result);
                res.end();
            }
        })(req, res, next);
    });

    // router.post('/logout', async (req, res) => {
    //     req.logout();
    //     res.redirect('/');
    // });
    return router;
};
