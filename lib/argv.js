var remote = require('./remote');
var argv = module.exports = require('optimist').argv;

// bare args with a leading + are remotes
var args = argv._.reduce(function (acc, arg) {
    if (!/^\+/.test(arg)) acc.remote = arg
    else acc._.push(arg)
    return acc;
}, { _ : [] });
argv.remote = argv.remote || args.remote;
argv._ = args._;

var target = remote.get(argv.remote || 'default');
if (target && !argv.hub) argv.hub = target.hub;
if (target && !argv.secret) argv.secret = target.secret;
