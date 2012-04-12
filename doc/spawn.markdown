fleet-spawn(1) -- Run services on drones.
=========================================

## SYNOPSIS

    fleet spawn [<options>] -- [<command>...]

## DESCRIPTION

Execute `<command>` on a drone and restart the process when it dies.

Your spawned process will get the `$REPO` name, `$COMMIT` hash, `$DRONE_ID`, and
`$PROCESS_ID` as environment variables from propagit.

## OPTIONS

* drone - Specify a drone to connect to by its drone ID. You can specify `'*'`
  to spawn a command on all the drones. 
* env.`<name>` - Set environment variables for the commands.
* commit - Spawn the command on a specific deployed commit.
  Defaults to the latest commit.
* repo - Spawn the command under this repo name.
  Defaults to the closest directory name with a `.git/` in it.

If you haven't set a remote with `fleet remote`, you'll need to specify these
options:

* hub - location of the hub as a "host:port" string
* secret - optional passphrase to connect to the hub

## EXAMPLE

Start a process on a randomly-selected drone:

    $ fleet spawn -- node server.js 8888
    (spawned a25d7033#edc743)

Start a process with custom environment variables:

    $ fleet spawn --env.FOO=3 --env.BAR=kapow -- ./beep.js 5000
    (spawned b95fc0fd#07ac33)
