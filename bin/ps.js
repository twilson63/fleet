#!/usr/bin/env node
var argv = require('../lib/argv');
var propagit = require('propagit');
var EventEmitter = require('events').EventEmitter;

var p = propagit(argv);
p.on('error', function (err) {
    console.dir(err);
});

p.hub.on('up', argv.json ? raw : text);

function text (hub) {
    var em = new EventEmitter;
    
    em.on('data', function (key, procs) {
        console.log('drone#' + key);
        
        var pids = Object.keys(procs);
        pids.forEach(function (pid, ix) {
            var last = ix === pids.length - 1;
            var p = procs[pid];
            console.log(
                (last ? '└' : '├') + '─┬ '
                + 'pid#' + pid
            );
            console.log([
                '',
                ' ├── status:   ' + p.status,
                ' ├── commit:   ' + p.repo + '/' + p.commit,
                ' └── command:  ' + p.command.join(' '),
            ].join('\n' + (last ? ' ' : '│')).slice(1));
        });
    });
    
    em.on('end', function () {
        p.hub.close();
    });
    
    hub.ps(em.emit.bind(em));
}

function raw (hub) {
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
}
