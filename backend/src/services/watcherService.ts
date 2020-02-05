
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

export default class WatcherService {

    test() {
        let tmpDirectory = path.join(__dirname, 'backend/src/', 'test.txt');

        fs.watchFile(tmpDirectory, (curr: any, prev: any) => {
            console.log(
                `[${new Date().toLocaleString()}] Watching for file changes on: ${tmpDirectory}`
            );
        })
    }

    watchFile(targetFile: string) {
        console.log("targetFile", targetFile);
        try {
            console.log(
                `[${new Date().toLocaleString()}] Watching for file changes on: ${targetFile}`
            );
            let tmpDirectory = path.join(__dirname, 'backend/src/', targetFile);
            var watcher = chokidar.watch(tmpDirectory, { persistent: true });
            
            console.log("targetFile", tmpDirectory);

            watcher.on('change', async (filePath: string) => {
                console.log(
                    `[${new Date().toLocaleString()}] ${filePath} has been updated.`
                );
            });
        } catch (error) {
            console.log(error);
        }
    }
}