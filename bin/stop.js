#!/usr/bin/env node
var argv = require('../lib/argv');
var propagit = require('propagit');
var git = require('../lib/git');

var p = propagit(argv);
p.on('error', function (err) {
    console.dir(err);
});

if (argv._.length === 0) {
    console.error('Usage: fleet stop PID');
    process.exit();
}

p.hub(function (hub) {
    var opts = {
        drone : argv.drone,
        drones : argv.drones,
        pid : argv._[0].replace(/^pid#/, ''),
    };
    hub.stop(opts, function (drone) {
        console.log('[' + drone + '] stopped ' + opts.pid);
        p.hub.close();
    });
});
