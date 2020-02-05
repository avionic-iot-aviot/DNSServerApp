import * as express from 'express';
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.listen(3880, () => {
  console.log('Application listening on port 3880!');
});

import test from './services/watcherService';
const t = new test();
t.test();
module.exports = app;
