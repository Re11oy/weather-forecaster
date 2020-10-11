#!/usr/bin/env bash

onexit() {
  docker-compose down
  kill "$host_pid"
}

trap onexit "EXIT"

docker-compose up -d
WEATHER_PROVIDER=NOOP yarn start &
host_pid=$!
npx wait-on http://localhost:8080

pushd server
  yarn test-integration
popd
