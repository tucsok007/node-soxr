#!/bin/sh

set DOCKER_BUILDKIT=1

docker build -t node-soxr-linux -f targets/cross-compile.dockerfile --build-arg PLATFORM=linux --platform linux/amd64,linux/arm64,linux/ppc64le,linux/s390x --target exporter --output type=local,dest=./output .
#docker build -t node-soxr-linux-musl -f targets/linux-musl.dockerfile --platform linux/amd64,linux/arm64,linux/s390x --target exporter --output type=local,dest=./output .
docker build -t node-soxr-windows -f targets/cross-compile.dockerfile --build-arg PLATFORM=win32 --platform linux/amd64,linux/arm64 --target exporter --output type=local,dest=./output .
docker build -t node-soxr-darwin -f targets/cross-compile.dockerfile --build-arg PLATFORM=darwin --platform linux/amd64,linux/arm64 --target exporter --output type=local,dest=./output .
docker build -t node-soxr-freebsd -f targets/cross-compile.dockerfile --build-arg PLATFORM=freebsd --platform linux/amd64,linux/arm64,linux/ppc64le --target exporter --output type=local,dest=./output .
docker build -t node-soxr-openbsd -f targets/cross-compile.dockerfile --build-arg PLATFORM=openbsd --platform linux/amd64,linux/arm64,linux/ppc64le --target exporter --output type=local,dest=./output .
docker build -t node-soxr-sunos -f targets/cross-compile.dockerfile --build-arg PLATFORM=sunos --platform linux/amd64,linux/arm64 --target exporter --output type=local,dest=./output .
docker build -t node-soxr-aix -f targets/cross-compile.dockerfile --build-arg PLATFORM=aix --platform linux/amd64,linux/arm64 --target exporter --output type=local,dest=./output .
