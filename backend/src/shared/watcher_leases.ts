const fs = require('fs');
const path = require('path');
const cfg = require('config');

import LeasesService from '../services/leasesServices';
const leasesService = new LeasesService();

function updateLeases() {
    console.log(`[${new Date().toLocaleString()}] Scheduled updateLease operation. Watching for file changes on: ${cfg.watcher_leases.path_to_watch}`);
    leasesService.leasesServices(true);
    setTimeout(updateLeases, cfg.watcher_leases.refresh_time);
}


fs.watchFile(cfg.watcher_leases.path_to_watch, (curr: any, prev: any) => {
    console.log(`[${new Date().toLocaleString()}] Watching for file changes on: ${cfg.watcher_leases.path_to_watch}`);
    leasesService.leasesServices(true);
})

updateLeases();

