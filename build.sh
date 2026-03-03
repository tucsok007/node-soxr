#!/bin/sh

usage() {
  echo "Usage: $0 [OPTIONS]"
  echo "Options:"
  echo " -h, --help     Display this help message."
  echo " -c, --cleanup  Cleanup files after build."
  echo " -p, --pack     Pack the output into an npm package."
}

cleanup() {
  ./cleanup.sh
}

build() {
  echo 'Removing previous build files (if they exist)...';
  cleanup

  echo 'Setting up Docker buildx env...';
  export DOCKER_BUILDKIT=1

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
}

pack() {
  echo 'Creating an npm package...';
  npm pack
}

should_pack=false
should_cleanup=false

handle_options() {
  while [ $# -gt 0 ]; do
    case $1 in
      -h | --help)
        usage
        exit 0
        ;;
      -c | --cleanup)
        should_cleanup=true
        ;;
      -p | --pack)
        should_pack=true
        ;;
      *)
        echo "Invalid option: $1" >&2
        usage
        exit 1
        ;;
    esac
    shift
  done
}

handle_options "$@"

build
if [ "$should_pack" = true ] ; then
  pack
fi
if [ "$should_cleanup" = true ] ; then
  cleanup
fi
