const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors({ origin: '*', methods: 'GET' }));
app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (_, res) => res.sendFile(path.join(__dirname, '../build/index.html')));
app.listen('6970', '0.0.0.0');

console.log('listening on localhost:6970!');

process.on('unhandledRejection', err => {
  console.error('**UNHANDLED REJECTION**');
  console.error(err);
});
