#!/usr/bin/env node
var EventEmitter = require('events').EventEmitter;

var propagit = require('propagit');
var archy = require('archy');

var argv = require('../lib/argv');
if (!argv.hub) return console.error('Specify a --hub or set a remote.');

var p = propagit(argv);
p.on('error', function (err) {
    console.dir(err);
});

p.hub.on('up', argv.json ? raw : text);

function text (hub) {
    var em = new EventEmitter;
    
    em.on('data', function (key, procs) {
        var s = archy({
            label : 'drone#' + key,
            nodes : Object.keys(procs).map(function (id) {
                var p = procs[id];
                return {
                    label : 'pid#' + id,
                    nodes : [
                        'status:   ' + p.status,
                        'commit:   ' + p.repo + '/' + p.commit,
                        'command:  ' + p.command.join(' '),
                    ],
                }
            }),
        });
        console.log(Object.keys(procs).length ? s : s.replace(/\n$/, ''));
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
