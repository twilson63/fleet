#!/usr/bin/env node
var propagit = require('propagit');

var git = require('../lib/git');
var argv = require('../lib/argv');

var p = propagit(argv);
p.on('error', function (err) {
    console.log(err.stack || err.toString());
});

p.hub(function (hub) {
    var opts = {
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
    var ref = 'http://' + argv.hub.split(':')[0]
        + ':' + hub.ports.git + '/' + opts.repo;
    
    git.push(ref, function (err) {
        if (err) {
            console.error(err);
            p.hub.close();
        }
        else hub.deploy(opts, function (errors) {
            if (errors) {
                errors.forEach(function (err) {
                    console.error(
                        '[' + err.drone + '] '
                        + (err.code === 128 ? 'already at latest' : err)
                    );
                });
            }
            else {
                console.log('deployed ' + opts.repo + '/' + opts.commit);
            }
            p.hub.close();
        });
    });
}
