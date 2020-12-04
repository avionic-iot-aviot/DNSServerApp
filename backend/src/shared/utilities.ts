import { IResultRequest } from "../interfaces/interfaces";

const request = require('request');

export class Utilities {
    // metodo che prende in ingresso le configurazioni relative ad una richiesta (url, method, etc)
    // e procede ad effettuare la richiesta stessa
    static request(request_data: any): any {

        const result: IResultRequest = {
            success: false,
            body: null,
            error: null
        };
        // let request_data = {
        //     url: cfg.provider.requestTokenGarmin,
        //     method: 'POST',
        // }
        // const headers = {};
        // request_data.headers = headers;
        return new Promise((resolve, reject) => {
            request(
                request_data,
                function (error: any, response: any, body: any) {
                    if (!error) {
                        result.success = true;
                    }
                    result.body = body;
                    result.error = error;
                    resolve(result);
                }
            );
        });
    }
}