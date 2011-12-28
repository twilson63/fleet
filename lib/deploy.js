var net = require('net');
var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;

var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var mkdirp = require('mkdirp');
var chdir = require('chdir');

var pushover = require('pushover');
var gitEmit = require('git-emit');

module.exports = function (opts) {
    if (typeof opts === 'string') {
        opts = { dir : opts };
    }
    if (typeof opts.dir === 'string') {
        opts.dir = {
            repo : opts.dir + '/repos',
            deploy : opts.dir + '/deploys',
        };
    }
    mkdirp.sync(opts.dir.repo, 0700);
    mkdirp.sync(opts.dir.deploy, 0700);
    
    return new Server(opts);
};

function Server (opts) {
    var self = this;
    self.routes = {};
    self.repoDir = opts.dir.repo;
    self.deployDir = opts.dir.deploy;
    
    self.repos = pushover(self.repoDir);
    self.repos.on('push', self.onpush.bind(self));
    
    self.git = fs.readdirSync(self.repoDir).reduce(function (acc, repo) {
        acc[repo] = gitEmit(path.join(self.repoDir, repo));
        acc[repo].on('update', self.onupdate.bind(self, repo));
        return acc;
    }, {});
}

Server.prototype = new EventEmitter;

Server.prototype.handle = function () {
    return this.repos.handle.apply(this.repos, arguments);
};

Server.prototype.onupdate = function (repo, update) {
    var self = this;
    var branch = update.arguments[0].split('/')[2];
    var commit = update.arguments[2];
    
    var deployDir = path.join(self.deployDir, repo, commit);
    mkdirp(deployDir, 0700, function (err) {
        if (err) update.reject(500, err)
        else self.deploy(repo, branch, commit, function (err) {
            if (err) update.reject(500, err)
            else update.accept()
        });
    });
};

Server.prototype.onpush = function (repo) {
    var self = this;
    if (self.git[repo]) return;
    
    self.git[repo] = gitEmit(path.join(self.repoDir, repo));
    self.git[repo].on('update', self.onupdate.bind(self, repo))
    
    self.lastCommit(repo, function (commit) {
        self.onupdate(repo, {
            arguments : [ 'refs/head/master', null, commit ],
            accept : function () {},
            reject : function (code, err) {
                console.error([ code, err ].filter(Boolean).join(' '));
            },
        });
    });
};
 
Server.prototype.lastCommit = function (repo, cb) {
    chdir(path.join(this.repoDir, repo), function () {
        // grab the last commit
        var cmd = 'git log -n1 --pretty="format:%H"';
        exec(cmd, function (err, stdout, stderr) {
            var commit = stdout.trim();
            cb(commit);
        });
    });
};

Server.prototype.createDeployDir = function (repo, commit, cb) {
    var dir = path.join(this.deployDir, repo, commit);
    var ps = spawn('git', [ 'init', dir ]);
    
    ps.on('exit', function (code) {
        if (code !== 0) cb('clone exited with code ' + code);
        else cb(null, dir)
    });
};

Server.prototype.fetch = function (repo, commit, cb) {
    var repoDir = path.join(this.repoDir, repo);
    var dir = path.join(this.deployDir, commit);
    
    chdir(dir, function () {
        var ps = spawn('git', [ 'fetch', repoDir, commit ]);
        ps.stdout.pipe(process.stdout, { end : false });
        ps.stderr.pipe(process.stdout, { end : false });
        
        ps.on('exit', function (code) {
            if (code !== 0) cb('git fetch exited with non-zero status')
            else cb()
        });
    });
};

Server.prototype.checkout = function (repo, commit, cb) {
    var repoDir = path.join(this.repoDir, repo);
    var dir = path.join(this.deployDir, commit);
    
    chdir(dir, function () {
        var ps = spawn('git', [ 'checkout', commit ]);
        ps.stdout.pipe(process.stdout, { end : false });
        ps.stderr.pipe(process.stdout, { end : false });
        
        ps.on('exit', function (code) {
            if (code !== 0) cb('git fetch exited with non-zero status')
            else cb()
        });
    });
};

Server.prototype.clone = function (repo, commit) {
    var self = this;
    
    self.createDeployDir(repo, commit, function (err, dir) {
        if (err) cb(err)
        else self.fetch(repo, commit, function (err) {
            if (err) cb(err)
            else self.checkout(repo, commit, function (err) {
                if (err) cb(err)
            });
        });
    });
};

Server.prototype.deploy = function (repo, branch, commit, cb) {
    var self = this;
    var deployDir = path.join(self.deployDir, repo, commit);
    var repoDir = path.join(self.repoDir, repo);
    
    
    var jsonFile = path.join(deployDir, 'deploy.json');
    
    ps.on('exit', function (code) {
        if (code !== 0) cb('clone exited with code ' + code);
        else path.exists(jsonFile, function (ex) {
            if (!ex) cb('no deploy.json file present')
            else fs.readFile(jsonFile, function (err, body) {
                try { var config = JSON.parse(body) }
                catch (err) { return cb(err) }
                if (!config.start) return cb('no start field present')
                
                var port = Math.floor(Math.random() * 5e4 + 1e4);
                self.routes[commit] = port;
                
                chdir(deployDir, function () {
                    var cmd = config.start.split(' ').concat(port);
                    var ps = spawn(cmd[0], cmd.slice(1));
                    
                    ps.stdout.pipe(process.stdout, { end : false });
                    ps.stderr.pipe(process.stdout, { end : false });
                });
                
                cb(null);
            });
        })
    });
};
