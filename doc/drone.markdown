fleet-drone(1) -- Connect to a hub as a worker.
===============================================

## SYNOPSIS

    fleet drone [<options>]

## DESCRIPTION

Connect to a fleet hub and register as a worker drone.

## OPTIONS

* --name - name to give this drone, defaults to `os.hostname()`
* --hub - connect to this hub as a `host:port` string
* --secret - optional passphrase to connect to the hub

## EXAMPLE

    fleet drone --hub=10.0.5.2:7000 --secret=beepboop
