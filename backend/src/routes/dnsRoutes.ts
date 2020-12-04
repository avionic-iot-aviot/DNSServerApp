const config = require('config');
import * as express from 'express';
const _ = require('lodash');
const router = express.Router();
import * as HttpStatus from 'http-status-codes';
const delay = require('delay');

import DnsService from '../services/dnsServices';
const dnsService = new DnsService();

router.post('/dns_request', async (req, res) => {
    const body = req.body;
    var ip = req.connection.remoteAddress.split(":")[((req.connection.remoteAddress.split(":")).length)-1]
    try {
        const params = body && body.params ? body.params : null;
        console.log("dnsRoutes received("+ip+"): ","PARAMS", params);
        if (params && params.ipdns) {
            const result = await delay(1000);
            await dnsService.SendPostResponse(ip);
        }
        res.status(HttpStatus.OK).send();
    } catch (error) {
        res.status(HttpStatus.OK).send(error);
    }
});

module.exports = router;