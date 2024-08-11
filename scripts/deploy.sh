#!/usr/bin/env sh

# https://cli.vuejs.org/guide/deployment.html#github-pages

# abort on errors
set -e

VITE_API_DOMAIN=https://ashermorgan.github.io BASE_URL=/running-tools/ npm run build

cd dist

git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:ashermorgan/running-tools.git master:gh-pages

cd -
