FROM node:24-slim AS base

RUN apt update
RUN apt install build-essential make cmake gcc g++ python3 -y

FROM base AS builder

WORKDIR /app
COPY ../ .

ARG PLATFORM=linux

RUN npx node-pre-gyp configure --target_platform=${PLATFORM} --napi
RUN npx node-pre-gyp install --target_platform=${PLATFORM} --napi --fallback-to-build
RUN npx node-pre-gyp clean build package --target_platform=${PLATFORM} --napi

FROM scratch AS exporter

COPY --from=builder /app/lib /lib