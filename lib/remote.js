var git = require('./git');

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

exports.add = function (name, opts) {
    remote[name] = opts;
    save();
};

exports.remove = function (name) {
    delete remote[name];
    save();
};

exports.list = function () {
    return remote;
};
