#!/usr/bin/env node
const service = require('./user.js');
service.listen();
module.exports = service;
