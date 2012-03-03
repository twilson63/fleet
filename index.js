var argv = require('./lib/argv');
var propagit = require('propagit');
var EventEmitter = require('events').EventEmitter;

function Commands (opts) {
    this.opts = opts
}
Commands.prototype.ps = function (cb) {
    var p = propagit(this.opts);
    p.on('error', function (err) {
        cb(err);
    });
    p.hub.on('up', function (hub) {
        var em = new EventEmitter;
        var obj = {};

        em.on('data', function (key, procs) {
            obj[key] = procs
        });

        em.on('end', function () {
            cb(null, obj)
        });

        hub.ps(em.emit.bind(em));
    });
}

module.exports = function (opts) {
    return new Commands(opts)
}


