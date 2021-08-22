#!/usr/bin/env sh

# https://cli.vuejs.org/guide/deployment.html#github-pages

# abort on errors
set -e

npm run build

cd dist

git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:ashermorgan/running-tools.git master:gh-pages

cd -
