import { IResultRequest } from "../interfaces/interfaces";
const fs = require('fs');
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
    // metodo che permette di scrivere un file
    // filename = path del file
    // content = contenuto da scrivere nel file
    static writeFile(filename: string, content: string) {
        fs.writeFile(filename, content, function (err: any) {
            if (err) console.log(err);
            else console.log("file saved");
        });
    }
}