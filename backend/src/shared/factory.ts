import { IDataResponse } from '../interfaces/interfaces';
const _ = require('lodash');

exports.generateSuccessResponse = (data: any, error: any, message: string): IDataResponse => {
  return {
    status: 'success',
    payload: data || {},
    error: error || '',
    message: message || '',
  };

};

exports.generateErrorResponse = (data: any, error: any, message: string): IDataResponse => {
  return {
    status: 'error',
    payload: data || {},
    error: error || '',
    message: message || '',
  };

};

