#!/usr/bin/env node
var propagit = require('propagit');
var seaport = require('seaport');
var argv = require('optimist').argv;

var cport = argv.cport || argv.port || argv._[0];
var sport = argv.sport || cport + 1;
var gport = argv.gport || sport + 1;

var prop = propagit(argv).listen(cport, gport);
prop.ports.seaport = sport;

var subs = {};
prop.use(function (service, conn) {
    service.emit = function () {
        var args = [].slice.call(arguments);
        Object.keys(subs).forEach(function (key) {
            subs[key].apply(null, args);
        });
    };
    
    service.subscribe = function (emit) {
        if (typeof emit === 'function') {
            conn.once('end', function () {
                delete subs[conn.id];
            });
            subs[conn.id] = emit;
        }
    };
});

var ports = seaport.createServer();
ports.listen(sport);
