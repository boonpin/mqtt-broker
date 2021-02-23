#!/bin/sh

echo "startup begin"
set -e

if [ -f /release ]; then
  cat /release
fi

cd /app

node build-config.js
node src/broker
