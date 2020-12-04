const fs = require('fs');
const path = require('path');
const cfg = require('config');

import LeasesService from '../services/leasesServices';
const leasesService = new LeasesService();


fs.watchFile(cfg.watcher_leases.path_to_watch, (curr: any, prev: any) => {
    console.log(`[${new Date().toLocaleString()}] Watching for file changes on: ${cfg.watcher_leases.path_to_watch}`);
    leasesService.leasesServices(true);
})
