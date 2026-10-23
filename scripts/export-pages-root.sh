#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
VITE_BASE_PATH=/drip-essential/ pnpm build:static
rm -rf /tmp/drip-pages-root
mkdir -p /tmp/drip-pages-root
cp -R dist/public/. /tmp/drip-pages-root/
cp /tmp/drip-pages-root/index.html /tmp/drip-pages-root/404.html
cp /tmp/drip-pages-root/index.html ./index.html
cp /tmp/drip-pages-root/404.html ./404.html
cp -R /tmp/drip-pages-root/assets .
cp -R /tmp/drip-pages-root/api .
cp /tmp/drip-pages-root/favicon.svg ./favicon.svg
touch .nojekyll
printf '\nRoot Pages files:\n'
find assets api -maxdepth 2 -type f | sort | head -20
printf '\nBuilt references:\n'
grep -oE '(src|href)="[^"]+' index.html
