import { IResultRequest } from "../interfaces/interfaces";
const cfg = require('config');
const leases = require('dnsmasq-leases');
const fs = require('fs');
const path = require('path');
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

      // il metodo legge il file relativo alle leases (es. dnsmasq.leases) e ritorna un array di oggetti
    // dove ogni oggetto ha come keys: mac, ip, host, timestamp
    static getCurrentLeases() {
        try {
            let tmpDirectoryLeases = cfg.watcher && cfg.watcher.leases_path ? cfg.watcher.leases_path : path.join(__dirname, '../../src/leases');
            let leasesData = [];
            let data = fs.readFileSync(tmpDirectoryLeases, 'utf8');
            console.log("data", data);
            if (data) {
                leasesData = leases(data);
            }
            return leasesData;
        } catch (error) {
            console.log("ERROR", error);
            return null;
        }
    }
}