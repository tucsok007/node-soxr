#!/bin/bash
set -e

platforms=("linux/x64" "linux/arm64" "linux/s390x" "linux/ppc64le")
flavors=("musl" "glibc")

platform=""
flavor="glibc"

build() {
  echo 'Removing previous build files (if they exist)...';
  cleanup

  echo 'Setting up Docker buildx env...';
  export DOCKER_BUILDKIT=1

  echo 'Building...';
  if [ $flavor == "musl" ]; then
    docker build -t node-soxr-linux-musl -f targets/linux-musl.dockerfile --platform $platform --target exporter --output type=local,dest=./output .
  else
    docker build -t node-soxr-linux -f targets/linux.dockerfile --build-arg PLATFORM=linux --platform $platform --target exporter --output type=local,dest=./output .
  fi

  echo 'Re-organizing build output...';
  mkdir -p prebuilds
  cp -vnr ./output/prebuilds/* ./prebuilds
  rm -rf ./output
}

includes() {
  local check_against=$1
  local items=("${@:2:$#-1}")

  for item in "${items[@]}"; do
    if [[ "$item" == "$check_against" ]]; then
      return 0;
    fi
  done

  return 1;
}

if [ $# -lt 1 ]; then
  echo "Misising platform."
else
  if includes $1 "${platforms[@]}"; then
    if [ $1 == "linux/x64" ]; then
      platform="linux/amd64"
    else
      platform=$1
    fi
    if [ $# -gt 1 ]; then
      if [ $# -lt 3 ]; then
        if includes $2 "${flavors[@]}"; then
          flavor=$2
          build
        else
          echo "Flavor not allowed."
        fi
      else
        echo "Too many arguments."
      fi
    else
      build
    fi
  else
    echo "Platform not allowed."
  fi
fi
