import * as _ from 'lodash';
import api from './api';
import BBPromise from 'bluebird';
import { IUser } from '../../interfaces/user';

class UsersApi extends api {
  createUser(user: IUser) {
    return new BBPromise((resolve, reject) => {
      const url = '/api/private/user/createUser';
      const params = user;
      this.getClient(axiosClient => {
        axiosClient.post(url, { params })        
          .then((data) => {
            resolve(data);
          }).catch((error) => {
            resolve(error);
          });
      }, null, false);
    });
  }

  login(username: string, password: string) {
    return new BBPromise((resolve, reject) => {
      const url = '/user/login';
      const data = { username, password };
      this.getClient(axiosClient => {
        axiosClient.post(url, data)
          .then((data) => {
            resolve(data);
          }).catch((error) => {
            resolve(error);
          });
      }, null, false);
    });
  }

  me() {
    return new BBPromise((resolve, reject) => {
      const url = '/api/private/user/profile';
      this.getClient(axiosClient => {
        axiosClient.get(url)
          .then((data) => {
            resolve(data);
          }).catch((error) => {
            resolve(error);
          });
      });
    });
  }

  getAll() {
    return new BBPromise((resolve, reject) => {
      const url = '/api/private/user/getAll';
      let params: any = {};
      this.getClient(axiosClient => {
        axiosClient.get(url, { params })
          .then((data) => {
            resolve(data);
          }).catch((error) => {
            resolve(error);
          });
      }, null, false);
    });
  }

  getUser(user_id?: number) {
    return new BBPromise((resolve, reject) => {
      const url = '/api/private/user/profile';
      let params: any = {};
      if (user_id) {
        params.user_id = user_id;
      }
      this.getClient(axiosClient => {
        axiosClient.get(url, { params })
          .then((data) => {
            resolve(data);
          }).catch((error) => {
            resolve(error);
          });
      }, null, false);
    });
  }

}

const usersAPI = new UsersApi();
export default usersAPI;
