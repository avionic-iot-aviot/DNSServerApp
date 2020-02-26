import * as React from 'react';
import * as Constants from '../constants';
import * as _ from 'lodash';
import authutils from '../utils/authutils';
import Helpers from '../utils/helpers';

const checkLoginTimeout = Constants.jwt.TOKEN_WATCHDOG_TIMEOUT_SECS * 1000;
let isLogged = false;
let instance : TokenWatchdog;
let tokenTimeout : NodeJS.Timer;

export default class TokenWatchdog extends React.Component<any, any>{

  constructor(props : any) {
    super(props);
    instance = this;
  }

  render() {
    return (<></>);
  }

  componentDidMount() {
  }

  static init() {
    TokenWatchdog.setIsLogged(true);
    TokenWatchdog.checkLogin(true);
  }

  static setIsLogged(status : boolean) {
    isLogged = status;
  }

  static checkLogin(restart = false) {
    const isTokenEspired = authutils.isTokenExpired();
    Helpers.log('TokenWatchdog is checking the Token...(exp: '
      + authutils.getTokenExpirationDate(true) + ')');
    if (isTokenEspired && isLogged) {
      Helpers.log('TokenWatchdog is forcing LOGOUT...');
      authutils.dispatchLogoutUser();
      instance.props['history'].push('/');
    }
    if (!isTokenEspired && isLogged && restart) {
      clearTimeout(tokenTimeout);
      tokenTimeout = setTimeout(
        function () { TokenWatchdog.checkLogin(true); }, checkLoginTimeout);
    }
  }
}
