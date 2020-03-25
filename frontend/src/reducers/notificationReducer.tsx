import * as NotificationActions from '../actions/notificationActions';
import { INotification } from '../../interfaces/utils';

export default function notificationReducer(state = {}, action: any): any {
  switch (action.type) {
    case `${NotificationActions.STATUS_CHANGED}`:
      const data: INotification = action.payload;
      return { data };
    default:
      return state;
  }
}
