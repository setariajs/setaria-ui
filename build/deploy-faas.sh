#! /bin/sh
set -ex
mkdir temp_web
npm run deploy:build
cd temp_web
git clone --depth 1 -b gh-pages --single-branch https://github.com/bluejfox/setaria-ui.git && cd element

# build sub folder
SUB_FOLDER='1.6'
mkdir -p $SUB_FOLDER
rm -rf *.js *.css *.map static
rm -rf $SUB_FOLDER/**
cp -rf ../../examples/setaria-ui/** .
cp -rf ../../examples/setaria-ui/** $SUB_FOLDER/
cd ../..

# deploy domestic site
faas deploy daily -P element
rm -rf temp_web
