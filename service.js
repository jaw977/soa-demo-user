#!/usr/bin/env node

const service = require('./user.js');

service.clients();

if (process.argv[2] == '--listen') service.listen();

module.exports = service;
