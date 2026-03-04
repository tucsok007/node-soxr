#!/bin/sh
set -e

echo 'Installing dependencies...';
npm run install-ci

echo 'Building...';
npx prebuildify --napi --tag-libc
rm -rf ./node-soxr.d.ts ./node-soxr.js
npx tsc
mv -vn ./dist/* ./
rm -rf dist