import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import UserStore from '../../stores/userStore';
import RoleStore from '../../stores/roleStore';

import AuthHelper from '../../shared/authHelper';
import { IUser } from '../../interfaces/interfaces';
const _ = require('lodash');
const factory = require('../../shared/factory');

const router = express.Router();
const authHelper = new AuthHelper();
const userStore = new UserStore();
const roleStore = new RoleStore();
import { role } from '../../shared/constants';


router.get(
  '/refreshtoken', async (
    req: any,
    res: express.Response,
    next: express.NextFunction
  ) => {
  const currentUser: any = req.user;
  try {
    const userResponse = await userStore.findById(currentUser.id);
    if (userResponse && userResponse.length == 1) {
      const user = userResponse[0];
      const role = await roleStore.findBy({ id: user.role_id });
      if (role && role.length > 0) {
        const token = authHelper.generateToken(user.id, user.email, user.role_id);
        const result = factory.generateSuccessResponse(token, null);
        res.status(HttpStatus.OK).send(result);
        res.end();
      } else {
        const result = factory.generateErrorResponse(null, null, "User not found");
        res.status(HttpStatus.UNAUTHORIZED).send(result);
        res.end();
      }
    } else {
      const result = factory.generateErrorResponse(null, null, "User not found");
      res.status(HttpStatus.UNAUTHORIZED).send(result);
      res.end();
    }
  } catch (error) {
    const result = factory.generateErrorResponse(null, error, "ERROR");
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
    res.end();
  }
  return router;
}
);

router.get(
  '/profile', async (
    req: any,
    res: express.Response,
    next: express.NextFunction
  ) => {
  const currentUser: any = req.user;
  const user_id = req.query.user_id || currentUser.id;
  try {
    const userResponse = await userStore.findById(user_id);
    if (userResponse && userResponse.length == 1) {
      const user = userResponse[0];
      const result = factory.generateSuccessResponse(user, null, "User found");
      res.status(HttpStatus.OK).send(result);
    } else {
      const result = factory.generateErrorResponse(null, null, "User not found");
      res.status(HttpStatus.NOT_FOUND).send(result);
    }
  } catch (error) {
    const result = factory.generateErrorResponse(null, error, "ERROR");
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
    res.end();
  }
  return router;
}
);

router.get(
  '/getAll', async (
    req: any,
    res: express.Response,
    next: express.NextFunction
  ) => {
  const user: any = req.user;
  try {
    let searchUser: IUser = {};
    if (user.role_name == role.SUPER_ADMIN) {
      const roleRes = await roleStore.findBy({ name: role.ADMIN });
      if (roleRes && roleRes.length > 0) {
        searchUser.role_id = roleRes[0].id;
      } else {
        const result = factory.generateSuccessResponse(
          null,
          null,
          'Error'
        );
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
      }
    }
    const users = await userStore.findBy(searchUser);
    if (users && users.length > 0) {
      const result = factory.generateSuccessResponse(
        users,
        null,
        'Users found'
      );
      res.status(HttpStatus.OK).json(result);
    } else {
      const result = factory.generateSuccessResponse(
        null,
        null,
        'Users not found'
      );
      res.status(HttpStatus.OK).json(result);
    }
  } catch (error) {
    const result = factory.generateErrorResponse(
      null,
      error,
      'Users not found'
    );
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
  }
}
);

router.post('/createUser', async (req: any, res, next) => {
  const user = req.body.params;
  const currentUser: any = req.user;
  try {
    if (currentUser.role_name == role.SUPER_ADMIN) {


      const email = user.email.trim().toLowerCase();
      user.email = email;
      let userSearch: IUser = {
        email
      };
      const users = await userStore.findBy(userSearch);
      let message = '';
      if (users.length == 0) {
        const resCreation = await userStore.create(user);
        if (resCreation && resCreation.length == 1) {
          message = 'Sign Up successfully done'
          const result = factory.generateSuccessResponse(null, null, message);
          res.status(HttpStatus.OK).json(result);
        } else {
          const result = factory.generateErrorResponse(null, null, 'Error');
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
        }
      } else {
        message = 'User already exists.'
        const result = factory.generateSuccessResponse(null, null, message);
        res.status(HttpStatus.OK).json(result);
      }
    } else {
      const result = factory.generateErrorResponse(null, null, 'Error');
      res.status(HttpStatus.FORBIDDEN).json(result);
    }
  } catch (error) {
    const result = factory.generateErrorResponse(null, null, 'Error');
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
  }


});

module.exports = router;