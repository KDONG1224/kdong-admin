/* eslint-disable */
'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');

const app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(13000, function () {
  console.log('kdong-admin started: 5656');
});

function graceful() {
  process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
