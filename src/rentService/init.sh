#!/bin/sh

set -e

python3 -m http.server &
jolie src/server.ol ${SERVICE_NAME}