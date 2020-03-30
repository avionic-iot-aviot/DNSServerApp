const path = require('path');

import InsertDataSeedsService from '../services/insertDataSeedsService';
const insertDataSeedsService = new InsertDataSeedsService();

insertDataSeedsService.addRoles().then(() => {
    insertDataSeedsService.addUserSuperAdmin();
    insertDataSeedsService.addTenant();
})
