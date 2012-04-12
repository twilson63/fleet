fleet-exec(1) -- Run commands on drones.
========================================

## SYNOPSIS

    fleet exec [<options>] -- [<command>...]

## DESCRIPTION

Execute `<command>` on a drone and print the output of the command to the local
terminal.

Unlike `fleet spawn`, this command does not restart the process when
it exits.

Your spawned process will get the `$REPO` name, `$COMMIT` hash, `$DRONE_ID`, and
`$PROCESS_ID` as environment variables from propagit.

## OPTIONS

* drone - Specify a drone to connect to by its drone ID. You can specify `'*'`
  to exec a command on all the drones. 
* env.`<name>` - Set environment variables for the commands.
* commit - Spawn the command on a specific deployed commit.
  Defaults to the latest commit.
* repo - Execute the command under this repo name.
  Defaults to the closest directory name with a `.git/` in it.

If you haven't set a remote with `fleet remote`, you'll need to specify these
options:

* hub - location of the hub as a "host:port" string
* secret - optional passphrase to connect to the hub
