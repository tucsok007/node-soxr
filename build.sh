#!/bin/sh

echo 'Removing previous build files (if they exist)...';
./cleanup.sh

echo 'Setting up Docker buildx env...';
set DOCKER_BUILDKIT=1

echo 'Installing dependencies...';
npm run install-ci

echo 'Building...';
docker build -t node-soxr-linux-musl -f targets/linux-musl.dockerfile --platform linux/amd64,linux/arm64,linux/s390x --target exporter --output type=local,dest=./output .
docker build -t node-soxr-linux -f targets/linux.dockerfile --build-arg PLATFORM=linux --platform linux/amd64,linux/arm64,linux/ppc64le,linux/s390x --target exporter --output type=local,dest=./output .
npx prebuildify --napi --tag-libc

echo 'Re-organizing build output...';
mkdir prebuilds
for PLATFORM in linux_amd64 linux_arm64 linux_ppc64le linux_s390x; do
    cp -vnr ./output/$PLATFORM/prebuilds/* ./prebuilds
done
rm -rf ./output

echo 'Building TS wrapper...';
npx tsc
mv -vn ./dist/* ./
rm -rf dist

echo 'Creating an npm package...';
npm pack
./cleanup.sh
