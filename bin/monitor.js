#!/usr/bin/env node
var argv = require('optimist').argv;
var propagit = require('propagit');
var EventEmitter = require('events').EventEmitter;

var p = propagit(argv);
p.on('error', function (err) {
    console.dir(err);
});

p.hub.on('up', function (hub) {
    var em = new EventEmitter;
    em.on('spawn', function (id, opts) {
        console.dir([ 'spawn', id, opts ]);
    });
    
    em.on('stdout', function (buf, opts) {
        console.dir([ 'stdout', buf, opts ]);
    });
    
    hub.subscribe(em.emit.bind(em));
});
