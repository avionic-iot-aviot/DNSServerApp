import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import DeviceStore from '../../stores/deviceStore';
import DNSService from '../../services/dnsService';

import { IDevice, ISearchOpt } from '../../interfaces/interfaces';
const _ = require('lodash');
const factory = require('../../shared/factory');
const router = express.Router();
const deviceStore = new DeviceStore();
const dnsService = new DNSService();

router.get(
    '/', async (
        req: any,
        res: express.Response,
        next: express.NextFunction
    ) => {
    const device_id = req.query.id;
    try {
        // verifica esistenza device
        const deviceResponse = await deviceStore.findById(device_id);
        if (deviceResponse && deviceResponse.length == 1) {
            const device = deviceResponse[0];
            const result = factory.generateSuccessResponse(device, null, "Device found");
            res.status(HttpStatus.OK).send(result);
        } else {
            const result = factory.generateErrorResponse(null, null, "Device not found");
            res.status(HttpStatus.NOT_FOUND).send(result);
        }
    } catch (error) {
        const result = factory.generateErrorResponse(null, error, "ERROR");
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
        res.end();
    }
    return router;
}
);

router.get(
    '/getAll', async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
    try {
        const options = req.query.options;
        const search = req.query.search;
        // creazione oggetto di tipo ISearchOpt per la gestione della ricerca e della paginazione
        let searchOptions: ISearchOpt = options ? JSON.parse(options) : {};
        searchOptions.itemsPerPage = searchOptions.itemsPerPage || 25;
        searchOptions.activePage = searchOptions.activePage || 1;
        searchOptions.needle = search || "";
        const devicesRes = await deviceStore.getAll(searchOptions);

        if (devicesRes && devicesRes.length > 0) {
            const result = factory.generateSuccessResponse(
                { devices: devicesRes, options: searchOptions },
                null,
                'Devices found'
            );
            res.status(HttpStatus.OK).json(result);
        } else {
            const result = factory.generateSuccessResponse(
                null,
                null,
                'Devices not found'
            );
            res.status(HttpStatus.OK).json(result);
        }
    } catch (error) {
        const result = factory.generateErrorResponse(
            null,
            error,
            'Devices not found'
        );
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
}
);

router.post('/create', async (req, res, next) => {
    const device = req.body.params;
    try {
        const devices = await deviceStore.findBy(device);
        let message = '';
        if (!devices || devices.length == 0) {
            const resCreation = await deviceStore.create(device);
            if (resCreation && resCreation.length == 1) {
                message = 'Device successfully created';
                //metodo per creazione file per le configurazioni (hosts) di dnsmasq
                dnsService.searchAndSaveNewLeases();
                const result = factory.generateSuccessResponse(null, null, message);
                res.status(HttpStatus.OK).json(result);
            } else {
                const result = factory.generateErrorResponse(null, null, 'Error');
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
            }
        } else {
            message = 'Device already exists'
            const result = factory.generateSuccessResponse(null, null, message);
            res.status(HttpStatus.OK).json(result);
        }
    } catch (error) {
        console.log("ERR", error);
        const result = factory.generateErrorResponse(null, null, 'Error');
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
});

router.put('/update', async (req, res, next) => {
    const device = req.body.params;
    try {
        console.log("device", device);
        console.log("req.body", req.body);

        if (!device.id) {
            const result = factory.generateErrorResponse(null, null, 'Error');
            res.status(HttpStatus.BAD_REQUEST).json(result);
        }
        const devices = await deviceStore.findById(device.id);
        let message = '';
        if (devices.length == 1) {
            const resUpdate = await deviceStore.update(device);
            if (resUpdate) {
                //metodo per creazione file per le configurazioni (hosts) di dnsmasq
                dnsService.searchAndSaveNewLeases();
                message = 'Device successfully updated'
                const result = factory.generateSuccessResponse(null, null, message);
                res.status(HttpStatus.OK).json(result);
            } else {
                const result = factory.generateErrorResponse(null, null, 'Error');
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
            }
        } else {
            message = 'Device not found'
            const result = factory.generateSuccessResponse(null, null, message);
            res.status(HttpStatus.NOT_FOUND).json(result);
        }
    } catch (error) {
        const result = factory.generateErrorResponse(null, null, 'Error');
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
});

module.exports = router;