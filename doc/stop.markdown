fleet-stop(1) -- Stop processes running on drones.
==================================================

## SYNOPSIS

    fleet stop [<options>] <id0> [<id1>, <id2>...]

## DESCRIPTION

Stop processes. Get each `id` by running `fleet ps`. It doesn't matter which
drone the process is running on, fleet spams the request out to all the drones
and ignores the request if the drone doesn't have the requested process id.

Leading `'pid#'` strings are ignored on ids so you can more easily copy the pids
from `fleet ps` output.

## OPTIONS

If you haven't set a remote with `fleet remote`, you'll need to specify these
options:

* hub - location of the hub as a "host:port" string
* secret - optional passphrase to connect to the hub

## EXAMPLE

To stop 2 processes 1e99f4 and d7048a, just do:

    $ fleet stop 1e99f4 d7048a
    [3dfe17b8] stopped 1e99f4 d7048a
