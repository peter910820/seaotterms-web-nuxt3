#!/usr/bin/env bash
set -a
source .env
set +a

nohup node server/index.mjs &
