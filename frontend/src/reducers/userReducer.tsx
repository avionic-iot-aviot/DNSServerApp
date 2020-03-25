import * as UserActions from '../actions/userActions';
import { IRestResponse } from '../../interfaces/rest';
import usersApi from '../api/userApi';
import authutils from '../utils/authutils';
import moment from 'moment';
import TokenWatchdog from '../components/tokenwatchdog';

export default function userReducer(state = {}, action: any): any {
  let userdata: any = {};
  switch (action.type) {
    case `${UserActions.LOGIN}_PENDING`:
      const loginPromise = action.meta || {};
      return { loginPromise };

    case `${UserActions.LOGIN}_FULFILLED`:
      const response: IRestResponse = action.payload;
      const status = usersApi.getDataStatus(response);
      if (status === 'success') {
        const jwtToken = usersApi.getResponsePayload(response);
        authutils.setToken(jwtToken);
        userdata = authutils.getTokenPayload();

        userdata.updatedAt = moment();
      } else {
        userdata = null;
      }
      return { userdata, status };

    case `${UserActions.LOGIN}_REJECTED`: {
      return { userdata: null };
    }

    case `${UserActions.SET_STORE_FROM_TOKEN}`:
      userdata = authutils.getTokenPayload();
      userdata.updatedAt = moment();
      return { userdata };

    case `${UserActions.LOGOUT}`:
      TokenWatchdog.setIsLogged(false);
      authutils.deleteToken();
      return { logout: true, userdata: null };

    default:
      return state;
  }
}
