fleet-ps(1) -- List the running processes on the drones.
========================================================

## SYNOPSIS

    fleet ps [<options>]

## DESCRIPTION

List all the running processes on all the drones. The state of the process,
command used to execute the process, and the commit hash the process was
launched from are all displayed in the output.

If a drone doesn't have any processes running it will still show up in the
output.

## OPTIONS

If you haven't set a remote with `fleet remote`, you'll need to specify these
options:

* hub - location of the hub as a "host:port" string
* secret - optional passphrase to connect to the hub

## EXAMPLE

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
