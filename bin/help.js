#!/usr/bin/env node
var fs = require('fs');
var topic = process.argv[2] || 'summary';
var file = __dirname + '/../help/' + topic;

fs.createReadStream(file).pipe(process.stdout, { end : false });
