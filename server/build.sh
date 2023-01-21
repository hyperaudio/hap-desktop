#!/usr/bin/env sh
set -eu

cd $(git rev-parse --show-toplevel)
rm -rf app/server
mkdir -p app/server
cd server
poetry export -f requirements.txt --without-hashes -o requirements.txt
pyoxidizer build --release
cp -r build/*/release/install/* ../app/server/
