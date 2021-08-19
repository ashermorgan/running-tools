#!/usr/bin/env sh

# abort on errors
set -e

npm run build

cd dist

git init
git add -A
git commit -m 'deploy'
git push -f https://github.com/ashermorgan/running-tools master:gh-pages

cd -
