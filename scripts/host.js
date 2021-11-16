const express = require('express');
const cors = require('cors');
const path = require('path');
const levelup = require('levelup');
const encode = require('encoding-down');
const memdown = require('memdown');

const { AuthDB } = require('../lib/auth/auth-db');
const { AuthApi } = require('../lib/auth/auth-api');

const db = levelup(encode(memdown(), { valueEncoding: 'json' }))
const authDB = new AuthDB({ }, db);
const authApi = new AuthApi({ }, authDB);

const app = express();
app.use(cors({ origin: '*', methods: 'GET,POST,PUT,DELETE' }));
app.use(authApi.router);
app.get('/dump', (req, res) => {
  const data = { };
  const stream = db.createReadStream();
  stream.on('data', ({ key, value }) => {
      data[key] = value;
  }).on('close', () => res.json(data));
});
app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (_, res) => res.sendFile(path.join(__dirname, '../build/index.html')));
app.listen('6971', '0.0.0.0');

console.log('listening on localhost:6971!');

process.on('unhandledRejection', err => {
  console.error('**UNHANDLED REJECTION**');
  console.error(err);
});
