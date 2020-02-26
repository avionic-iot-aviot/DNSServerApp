import * as Constants from '../constants';
export default class Helpers {
  static log(...data: any[]) {
    if (Constants.general.DEBUG_MODE) {
      console.log(data);
    }
  }
}
