#!/usr/bin/env node
var argv = require('optimist').argv;
var propagit = require('propagit');
var seaport = require('seaport');
var EventEmitter = require('events').EventEmitter;

// todo: infer repo from dirname and commit from `git log|head -n1`

var p = propagit(argv);
p.on('error', function (err) {
    console.dir(err);
});

p.hub(function (hub) {
    var opts = {
        drone : argv.drone,
        repo : argv.repo,
        commit : argv.commit
    };
    hub.deploy(opts, function (cb) {
        p.hub.close();
    });
});
