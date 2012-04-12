fleet-monitor(1) -- Show service events system-wide.
====================================================

## SYNOPSIS

    fleet monitor [<options>]

## DESCRIPTION

Show all spawn, exit, stdout, and stderr events happening everywhere across all
of the drones.

## OPTIONS

If you haven't set a remote with `fleet remote`, you'll need to specify these
options:

* hub - location of the hub as a "host:port" string
* secret - optional passphrase to connect to the hub

## EXAMPLE

    $ fleet monitor
    (spawned 3dfe17b8#1e99f4 : node server.js 8888)
    [3dfe17b8#1e99f4] listening on :8888
    (exited 3dfe17b8#751e9f : node server.js 8889)
    (spawned 3dfe17b8#d7048a : node server.js 8889)
