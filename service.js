#!/usr/bin/env node

const service = require('./user.js');

if (process.argv[2] == '--listen') service.listen();

module.exports = service;
