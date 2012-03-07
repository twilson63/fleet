fleet
=====

Command an armada of processes in a cluster.

This module integrates with git using
[propagit](https://github.com/substack/propagit),
to make rolling out new code to a bunch of worker drones super simple!

install
=======

With [npm](http://npmjs.org) do:

```
npm install -g fleet
```

example
=======

In a fresh directory, start a fleet hub:

```
$ fleet hub --port=7000 --secret=beepboop
```

in another fresh directory start a drone:

```
$ fleet drone --hub=localhost:7000 --secret=beepboop
```

You can start as many drones as you want in fresh directories.

Now from a git repo, set a remote:

```
$ fleet remote add default --hub=localhost:7000 --secret=beepboop
```

Now deploy your code to all the drones:

```
$ fleet deploy
```

Deploying just checks out your commit to a fresh directory on every drone.

To run a process on the latest commit do:

```
$ fleet spawn -- node beep.js 8080
```

To see the process list across all your drones do:

```
$ fleet ps
```

commands
========

fleet remote
------------

This command creates and updates a file called `fleet.json` in your git project
root so you don't need to type --hub and --secret all the time for the deploy,
spawn, stop, and ps commands.

### fleet remote add NAME=default --hub=HUB --secret=SECRET

Register a remote with NAME and OPTIONS.

Inspired by `git remote`.

### fleet remote rm NAME

Delete a remote.

### fleet remote ls

List the remotes from your `fleet.json`.

fleet hub --port=PORT --secret=SECRET
-------------------------------------

Create a new hub listening on a port with a secret passphrase.

fleet drone --hub=HOST:PORT --secret=SECRET
-------------------------------------------

Spin up a worker drone and connect to the hub.

fleet deploy
------------

From a git directory, push the top commit from `git log` and check out the code
on all the drones in an isolated directory based on the commit hash.

```
$ fleet deploy
deployed webapp/1b8050fcaf8f1b02b9175fcb422644cb67dc8cc5
```

fleet ps
--------

List the processes running on all the drones.

```
$ fleet ps
drone#3dfe17b8
├─┬ pid#1e99f4
│ ├── status:   running
│ ├── commit:   webapp/1b8050fcaf8f1b02b9175fcb422644cb67dc8cc5
│ └── command:  node server.js 8888
└─┬ pid#d7048a
  ├── status:   running
  ├── commit:   webapp/1b8050fcaf8f1b02b9175fcb422644cb67dc8cc5
  └── command:  node server.js 8889
```

fleet spawn OPTIONS -- command...
---------------------------------

Spin up `command` on a random drone.

You can control which drone by specifying `--drone=id`.

Your spawned process will get the $REPO name, $COMMIT hash, $DRONE_ID, and
$PROCESS_ID as environment variables from propagit.

```
$ fleet spawn -- node server.js 8888
(spawned a25d7033#edc743)
```

fleet stop id0 [id1, id2...]
----------------------------

Stop processes. Get each `id` by running `fleet ps`. It doesn't matter which
drone the process is running on, fleet spams the request out to all the drones
and ignores the request if the drone doesn't have the requested process id.

Leading `'pid#'` strings are ignored on ids so you can more easily copy the pids
from `fleet ps` output.

```
fleet stop 1e99f4 d7048a
[3dfe17b8] stopped 1e99f4 d7048a
```

fleet monitor
-------------

Show all spawn, exit, stdout, and stderr events happening everywhere across all
of the drones.

```
$ fleet monitor
(spawned 3dfe17b8#1e99f4 : node server.js 8888)
[3dfe17b8#1e99f4] listening on :8888
(exited 3dfe17b8#751e9f : node server.js 8889)
(spawned 3dfe17b8#d7048a : node server.js 8889)
```
