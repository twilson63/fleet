#!/bin/bash
if test -z "$*"; then
  fleet-help
else
  fleet-$*
fi
