const config = require('config');
import * as express from 'express';
const _ = require('lodash');
const router = express.Router();
import * as HttpStatus from 'http-status-codes';
const delay = require('delay');

import HostService from '../services/hostServices';
const hostService = new HostService();

router.post('/refresh', async (req, res) => {
    const body = req.body;
    var ip = req.connection.remoteAddress.split(":")[((req.connection.remoteAddress.split(":")).length)-1]
    try {
        const params = body && body.params ? body.params : null;
        console.log("hostRoutes received("+ip+"): ","PARAMS", params);
        if (params) {
            await hostService.NewRulesForHostFile(params);
        }
        res.status(HttpStatus.OK).send();
    } catch (error) {
        res.status(HttpStatus.OK).send(error);
    }
});

module.exports = router;