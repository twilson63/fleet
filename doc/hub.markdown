fleet-hub(1) -- Create a hub for drones to connect.
===================================================

## SYNOPSIS

    fleet hub [<options>]

## DESCRIPTION

This command will create and update a file called `fleet.json` in your git
project root so that you don't need to type `--hub` and `--secret` all the time.

## OPTIONS

* --port - port to listen on
* --secret - optional plaintext passphrase

## EXAMPLE

    fleet hub --port=7000 --secret=beepboop
