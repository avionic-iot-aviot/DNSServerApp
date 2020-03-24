import * as express from 'express';
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const passport = require('passport');

require('./passport').setupStrategies(passport);

const pubApiDNSRoute = require('./routes/public/dnsRoutes');
const pubApiUserRoutes = require('./routes/public/userRoutes')(passport);

app.use('/dns', pubApiDNSRoute);
app.use('/user', pubApiUserRoutes);

const prvApiTenantRoute = require('./routes/private/tenantRoutes');
app.use('/private/tenant', prvApiTenantRoute);
const prtApiUserRoutes = require('./routes/private/userRoutes');

app.use('/api/private/user', prtApiUserRoutes);


const frontendPublic = path.join(__dirname, '../../frontend/public');
const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use('/public', express.static(frontendPublic));
app.use('/dist', express.static(frontendDist));
app.get('*', (req, res, next) => {
  res.sendFile(path.join(frontendPublic, '/index.html'));
});

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
