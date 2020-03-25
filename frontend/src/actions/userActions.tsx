import usersApi from '../api/userApi';
/*
 * action types
 */
export const LOGIN = 'LOGIN';
export const LOGIN_FULFILLED = 'LOGIN_FULFILLED';
export const SET_STORE_FROM_TOKEN = 'SET_STORE_FROM_TOKEN';
export const LOGOUT = 'LOGOUT';

/*
 * action creators
 */
export function login(email: string, password: string) {
  const p = usersApi.login(email, password);
  return {
    type: LOGIN,
    payload: p,
    meta: p
  };
}

export function setStoreFromToken() {
  return {
    type: SET_STORE_FROM_TOKEN,
    payload: {}
  };
}

export function logout() {
  return {
    type: LOGOUT,
    payload: {}
  };
}