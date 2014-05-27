var fs = require('fs');
var path = require('path');
var existsSync = fs.existsSync || path.existsSync;
var extend = require('extend');

var git = require('./git');
var gitDir = git.dir();
var fleetFile = gitDir + '/fleet.json';

var remote = {};
if (existsSync(fleetFile)) {
    var obj = JSON.parse(fs.readFileSync(fleetFile));
    remote = obj.remote || {};
}

function save () {
    var obj = { remote : remote };
    fs.writeFileSync(fleetFile, JSON.stringify(obj, undefined, 2) + '\n');
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

exports.get = function (name) {
    return remote[name];
};

exports.set = function (name, opts) {
    extend(true, remote[name], opts);
    save();
};
