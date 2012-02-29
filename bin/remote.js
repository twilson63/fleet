#!/usr/bin/env node
var argv = require('optimist').argv;
var git = require('../lib/git');

var fs = require('fs');
var path = require('path');

var gitDir = git.dir();
var fleetFile = gitDir + '/fleet.json';

var remote = {};
if (path.existsSync(fleetFile)) {
    remote = JSON.parse(fs.readFileSync(fleetFile));
}

function save () {
    fs.writeFileSync(fleetFile, JSON.stringify(remote, undefined, 2) + '\n');
}

var cmd = argv._[0];

if (cmd === 'add') {
    var name = argv._[1] || 'default';
    remote[name] = { hub : argv.hub, secret : argv.secret };
    save();
}
else if (cmd === 'rm') {
    var name = argv._[1] || 'default';
    delete remote[name];
    save();
}
else if (cmd === 'ls' || cmd === 'list') {
    console.log(JSON.stringify(remote, undefined, 2));
}
else {
    console.error('Usage: fleet remote (add|rm|ls)');
}
