fleet
=====

Command an armada of processes in a cluster.

status: not quite ready yet

This module ties together
[seaport](http://github.com/substack/seaport),
[pushover](https://github.com/substack/pushover),
[propagit](https://github.com/substack/propagit),
and
[bouncy](https://github.com/substack/bouncy)
in order to make pushing new code to a whole cluster at once
seemless and low-risk.

example
=======

In a fresh directory, start a fleet hub:

```
$ fleet hub --port=7000 --secret=beepboop
```

in another fresh directory on another machine, start up one or more drones:

```
$ fleet drone --hub=localhost:7000 --secret=beepboop
```

now from a git repo, deploy your code to the drones:

```
$ cd webapp
$ fleet deploy --hub=localhost:7000 --secret=beepboop
deployed webapp/2fd8906c77e93d209362531ed0c9c4a7de88bb88
```

from the same git repo, spawn a service on the drones:

```
$ fleet spawn --hub=localhost:7000 --secret=beepboop -- node server.js
```

commands
========

fleet remote
------------

fleet hub
---------

fleet drone
-----------

fleet deploy
------------

From a git directory, push the top commit from `git log` and check out the code
on all the drones in an isolated directory based on the commit hash.

fleet list
----------

fleet monitor
-------------

fleet router
------------

fleet spawn
-----------
