#!/usr/bin/env node
var argv = require('optimist').argv;
var seaport = require('seaport');
var propagit = require('propagit');
var drone = propagit(argv).drone();

var ports = null;
drone.hub(function (hub) {
    var host = argv.hub.split(':')[0];
    ports = seaport.connect(host, hub.ports.seaport);
});

var emit = function () {
    var args = [].slice.call(arguments);
    drone.hub(function (hub) {
        hub.emit.apply(null, args);
    })
};

drone.on('error', function (err) {
    emit('error', err);
    console.error(err && err.stack || err);
});

drone.on('spawn', function (id, opts) {
    emit('spawn', id, opts);
    console.log(
        '[' + opts.repo + '.' + opts.commit.slice(8) + '] '
        + opts.command.join(' ')
    );
});

drone.on('exit', function (code, sig, opts) {
    emit('exit', code, sig, opts);
    console.error([
        '[' + opts.repo + '.' + opts.commit.slice(8) + ']',
        opts.command.join(' '),
        'exited with code', code,
        'from', sig,
    ].join(' '));
});

drone.on('stdout', function (buf, opts) {
    emit('stdout', buf.toString(), opts);
    console.log('['
        + opts.repo + '.' + opts.commit.slice(8)
    + '] ' + buf);
});

drone.on('stderr', function (buf, opts) {
    emit('stderr', buf.toString(), opts);
    console.log('['
        + opts.repo + '.' + opts.commit.slice(8)
    + '] ' + buf);
});

drone.on('up', function () {
    console.log('connected to the hub');
});

drone.on('reconnect', function () {
    console.log('reconnecting to the hub');
});

drone.on('down', function () {
    console.log('disconnected from the hub');
});
