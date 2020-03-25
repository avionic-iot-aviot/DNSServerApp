import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import TenantStore from '../../stores/tenantStore';

import { ITenant } from '../../interfaces/interfaces';
const _ = require('lodash');
const factory = require('../../shared/factory');
const router = express.Router();
const tenantStore = new TenantStore();

router.get(
    '/', async (
        req: any,
        res: express.Response,
        next: express.NextFunction
    ) => {
    const tenant_id = req.query.id;
    try {
        const tenantResponse = await tenantStore.findById(tenant_id);
        if (tenantResponse && tenantResponse.length == 1) {
            const tenant = tenantResponse[0];
            const result = factory.generateSuccessResponse(tenant, null, "Tenant found");
            res.status(HttpStatus.OK).send(result);
        } else {
            const result = factory.generateErrorResponse(null, null, "Tenant not found");
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
        const tenantsRes = await tenantStore.findAll();
        if (tenantsRes && tenantsRes.length > 0) {
            const result = factory.generateSuccessResponse(
                tenantsRes,
                null,
                'Tenants found'
            );
            res.status(HttpStatus.OK).json(result);
        } else {
            const result = factory.generateSuccessResponse(
                null,
                null,
                'Tenants not found'
            );
            res.status(HttpStatus.OK).json(result);
        }
    } catch (error) {
        const result = factory.generateErrorResponse(
            null,
            error,
            'Tenants not found'
        );
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
}
);

router.post('/create', async (req, res, next) => {
    const tenant = req.body.params;
    try {
        const tenants = await tenantStore.findBy(tenant);
        let message = '';
        if (!tenants || tenants.length == 0) {
            const resCreation = await tenantStore.create(tenant);
            console.log("resCreatio", resCreation);

            if (resCreation && resCreation.length == 1) {
                message = 'Tenant successfully created'
                const result = factory.generateSuccessResponse(null, null, message);
                res.status(HttpStatus.OK).json(result);
            } else {
                const result = factory.generateErrorResponse(null, null, 'Error');
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
            }
        } else {
            message = 'Tenant already exists.'
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
    const tenant = req.body.params;
    try {
        if (!tenant.id) {
            const result = factory.generateErrorResponse(null, null, 'Error');
            res.status(HttpStatus.BAD_REQUEST).json(result);
        }
        const tenants = await tenantStore.findById(tenant.id);
        let message = '';
        if (tenants.length == 1) {
            const resUpdate = await tenantStore.update(tenant);
            if (resUpdate && resUpdate.length == 1) {
                message = 'Tenant successfully updated'
                const result = factory.generateSuccessResponse(null, null, message);
                res.status(HttpStatus.OK).json(result);
            } else {
                const result = factory.generateErrorResponse(null, null, 'Error');
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
            }
        } else {
            message = 'Tenant not found'
            const result = factory.generateSuccessResponse(null, null, message);
            res.status(HttpStatus.NOT_FOUND).json(result);
        }
    } catch (error) {
        const result = factory.generateErrorResponse(null, null, 'Error');
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
});

module.exports = router;