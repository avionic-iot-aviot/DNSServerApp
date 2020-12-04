const fs = require('fs');
const path = require('path');
const cfg = require('config');

import ArpService from '../services/arpService';
const arpService = new ArpService();

fs.watchFile(cfg.watcher_apr.path_to_watch, (curr: any, prev: any) => {
    console.log(`[${new Date().toLocaleString()}] Watching for file changes on: ${cfg.watcher_apr.path_to_watch}`);
    arpService.execute();
})
