import { INotification } from '../../interfaces/utils';

export const STATUS_CHANGED = 'STATUS_CHANGED';

export function globalStatusChanged(data: INotification) {
  return {
    type: STATUS_CHANGED,
    payload: data
  };
}
