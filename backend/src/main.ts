import * as express from 'express';
const bodyParser = require('body-parser');

const cfg = require('config');
const path = require('path');
const dotenv = require('dotenv');
const expressJwt = require('express-jwt');
const authenticate = expressJwt({ secret: cfg.jwt.jwtSecret });
const envFilename = path.join(
  __dirname,
  '../',
  'env/',
  cfg.env.envFilename
);
console.log(`loading env file '${envFilename}'...`);
dotenv.config({ path: envFilename });
const app = express();
app.use(bodyParser.json());

const passport = require('passport');

require('./passport').setupStrategies(passport);

const pubApiDNSRoute = require('./routes/public/dnsRoutes');
const pubApiUserRoutes = require('./routes/public/userRoutes')(passport);

const prvApiTenantRoute = require('./routes/private/tenantRoutes');
const prtApiUserRoutes = require('./routes/private/userRoutes');
const prtApiDeviceRoutes = require('./routes/private/deviceRoutes');

app.use('/dns', pubApiDNSRoute);
app.use('/user', pubApiUserRoutes);

app.use('/api/private/device', authenticate, prtApiDeviceRoutes);
app.use('/api/private/tenant', authenticate, prvApiTenantRoute);
app.use('/api/private/user', authenticate, prtApiUserRoutes);



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
