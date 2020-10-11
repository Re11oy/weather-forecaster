#!/usr/bin/env bash

onexit() {
  docker-compose down
}

trap onexit "EXIT"

docker-compose up -d
yarn start
