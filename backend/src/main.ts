import * as express from 'express';
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


// -----  API che gestisce le richieste di tipo dns  ----- \\
const pubApiDnsRoute = require('./routes/dnsRoutes');
app.use('/dns', pubApiDnsRoute);

// -----  API che gestisce le richieste di tipo host  ----- \\
const pubApiHostRoute = require('./routes/hostRoutes');
app.use('/host', pubApiHostRoute);


// -----  Avvia il job che sta in ascolto in modo da intercettare i cambiamenti dell'arp table ----- \\ 
require('./shared/watcher_arp');
// -----  Avvia il job che sta in ascolto in modo da intercettare i del file dnsmasq.leases  ----- \\ 
require('./shared/watcher_leases');


//import { WatcherService } from './shared/watcher';

//const WatcherService = require('./shared/watcher');
// import WatcherService from './shared/watcher';

// const watcherService = new WatcherService();
// watcherService.watcher_file_arp();
// watcherService.watcher_file_leases();


app.listen(3900, () => {
  console.log('Application listening on port 3900!');
});

module.exports = app;
