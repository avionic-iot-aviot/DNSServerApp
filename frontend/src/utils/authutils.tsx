import * as _ from 'lodash';
import * as Constants from '../constants';
import moment from 'moment';
import TokenWatchdog from '../components/tokenwatchdog';
import * as UserActions from '../actions/userActions';
import * as store from '../store';

class AuthUtils {
  getToken() {
    return localStorage.getItem(Constants.jwt.AUTHTOKEN_NAME) || null;
  }

  setToken(token: any) {
    localStorage.setItem(Constants.jwt.AUTHTOKEN_NAME, token);
    TokenWatchdog.init();
  }

  deleteToken() {
    localStorage.removeItem(Constants.jwt.AUTHTOKEN_NAME);
  }

  getTokenPayload() {
    const token = this.getToken();
    const payload = this.parseJwt(token);
    return payload;
  }

  parseJwt(token: any) {
    if (!token) {
      return null;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  getTokenExpirationDate(ishuman = false) {
    const token: any = this.getTokenPayload();
    let expDate = null;
    if (token) {
      expDate = ishuman ? moment(token.exp * 1000).format() : token.exp;
    }
    return expDate;
  }

  getTokenTimeToExpire() {
    const exp = this.getTokenExpirationDate();
    return exp ? moment(exp * 1000).fromNow(true) : 0;
  }

  checkToken() {
    const token = this.getToken();
    if (token) {
      const expired = this.isTokenExpired();
      if (expired) {
        this.dispatchLogoutUser();
        return false;
      } else {
        TokenWatchdog.init();
        return true;
      }
    }
    return false;
  }

  isTokenExpiresIn(secs: number) {
    const expDate = this.getTokenExpirationDate();
    if (!expDate) return true;
    const time = moment()
      .add(secs, 's')
      .unix();
    return expDate < time;
  }

  isTokenExpired() {
    return this.isTokenExpiresIn(0);
  }

  dispatchSetStoreFromToken() {
    store.default.dispatch(UserActions.setStoreFromToken());
  }

  dispatchLogoutUser() {
    store.default.dispatch(UserActions.logout());
  }
}

const authUtils = new AuthUtils();
export default authUtils;
