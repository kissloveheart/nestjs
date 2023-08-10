#!/bin/sh

set -e

if [[ $1 == "create" ]]; then
  if [ -z "$3" ]; then
    echo Please input file name
    exit 1
  fi
  cd src/migrations
  cross-env SUFFIX_ENV_NAME=$2 npx typeorm migration:create $3

elif [[ $1 == "run" ]]; then
  cross-env SUFFIX_ENV_NAME=$2 yarn typeorm migration:run

elif [[ $1 == "revert" ]]; then
  cross-env SUFFIX_ENV_NAME=$2 yarn typeorm migration:revert

else
  echo "not found command"
  exit 1
fi
