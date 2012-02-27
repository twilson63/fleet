var exec = require('child_process').exec;
var path = require('path');

exports.commit = function (cb) {
    exec('git log | head -n1', function (err, stdout, stderr) {
        if (err) cb(err)
        else if (stderr) cb(new Error(stderr))
        else cb(null, stdout.trim().split(/\s+/)[1]);
    });
};

exports.repo = function () {
    var ps = __dirname.split('/');
    for (var i = ps.length - 1; i > 0; i--) {
        var dir = ps.slice(0, i).join('/');
        if (path.existsSync(dir + '/.git')) return dir;
    }
};
