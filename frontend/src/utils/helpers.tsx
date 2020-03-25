import * as Constants from '../constants';
import { toast } from 'react-toastify';

export default class Helpers {
  static log(...data: any[]) {
    if (Constants.general.DEBUG_MODE) {
      console.log(data);
    }
  }

  static getToastType(status: string) {
    switch(status) {
      case "success":
      return toast.TYPE.SUCCESS
      case "info":
      return toast.TYPE.INFO
      case "warning":
      return toast.TYPE.WARNING
      case "error":
      return toast.TYPE.ERROR
      default:
      return toast.TYPE.DEFAULT
    }    
  }
}
