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
        repo : argv.repo || git.repoName(),
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
    var remote = 'http://' + argv.hub.split(':')[0]
        + ':' + hub.ports.git + '/' + opts.repo;
    
    git.push(remote, function (err) {
        if (err) {
            console.error(err);
            p.hub.close();
        }
        else {
            hub.deploy(opts, function () {
                console.log('deployed ' + opts.repo + '/' + opts.commit);
                p.hub.close();
            });
        }
    });
}
