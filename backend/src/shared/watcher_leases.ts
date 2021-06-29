const fs = require('fs');
const path = require('path');
const cfg = require('config');

import LeasesService from '../services/leasesServices';
const leasesService = new LeasesService();

/**
 * We force the lease watcher to work even when there aren't client connected in DHCP.
 * When no clients are connected in DHCP the file won't be modified and the table we bill shown empty even if there are clients with static ips.
 */
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

