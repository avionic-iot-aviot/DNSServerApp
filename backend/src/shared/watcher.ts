const fs = require('fs');
const path = require('path');
import ArpService from '../services/arpService';
const arpService = new ArpService();

let tmpDirectory = path.join(__dirname, '../../src/test.txt');
console.log("dirr",tmpDirectory);
fs.watchFile(tmpDirectory, (curr: any, prev: any) => {
    console.log("QUI");
    console.log(
        `[${new Date().toLocaleString()}] Watching for file changes on: ${tmpDirectory}`
    );
    arpService.execute();
})
