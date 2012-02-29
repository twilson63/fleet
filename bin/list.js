#!/usr/bin/env node
var argv = require('optimist').argv;
var propagit = require('propagit');
var seaport = require('seaport');
var EventEmitter = require('events').EventEmitter;

var p = propagit(argv);
p.on('error', function (err) {
    console.dir(err);
});

p.hub.on('up', function (hub) {
    var em = new EventEmitter;
    console.log('{');
    var ix = 0;
    
    em.on('data', function (key, procs) {
        if (ix++ > 0) process.stdout.write(',\n');
        
        process.stdout.write(
            '  ' + JSON.stringify(key) + ' : '
            + JSON.stringify(procs).replace(/\n/g, '\n  ')
        );
    });
    
    em.on('end', function () {
        console.log('\n}');
        p.hub.close();
    });
    
    hub.ps(em.emit.bind(em));
});
