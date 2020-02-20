import * as express from 'express';
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
// Avvia il job che sta in ascolto in modo da intercettare i cambiamenti sul file dnsmasq.leases 
// ad ogni modifica verrà richiamato il metodo per scansionare l'arp table e contattare i GW
require('./shared/watcher');
app.listen(3880, () => {
  console.log('Application listening on port 3880!');
});

// import test from './services/watcherService';
// const t = new test();
// t.test();
module.exports = app;
