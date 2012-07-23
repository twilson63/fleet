fleet-hub(1) -- Create a hub for drones to connect.
===================================================

## SYNOPSIS

    fleet hub [<options>]

## DESCRIPTION

This command creates a git server to accept git pushes and a command server to
accept drone connections.

## OPTIONS

* --port - port to listen on
* --secret - optional plaintext passphrase

## EXAMPLE

    fleet hub --port=7000 --secret=beepboop
