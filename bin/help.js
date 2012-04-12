#!/usr/bin/env node
var fs = require('fs');
var topic = process.argv[2] || 'summary';
var file = __dirname + '/../help/' + topic;

var s = fs.createReadStream(file);
s.pipe(process.stdout, { end : false });

s.on('error', function (err) {
    if (err.code === 'ENOENT') {
        console.log('no help for topic ' + JSON.stringify(topic));
    }
    else console.error(String(err));
});
