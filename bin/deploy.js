#!/usr/bin/env node
var argv = require('optimist').argv;
var propagit = require('propagit');
var seaport = require('seaport');
var EventEmitter = require('events').EventEmitter;

var git = require('../lib/git');

// todo: infer repo from dirname and commit from `git log|head -n1`

var p = propagit(argv);
p.on('error', function (err) {
    console.dir(err);
});

p.hub(function (hub) {
    var opts = {
        drone : argv.drone,
        repo : argv.repo || git.repo(),
        commit : argv.commit
    };
    if (!opts.repo) {
        console.error('specify --repo or navigate to a git repo');
        return;
    }
    if (!opts.commit) git.commit(function (err, commit) {
        if (err) {
            console.error(err);
            p.hub.close();
        }
        else {
            opts.commit = commit;
            deploy(hub, opts);
        }
    })
    else deploy(hub, opts);
});

function deploy (hub, opts) {
    hub.deploy(opts, function (cb) {
        p.hub.close();
    });
}
