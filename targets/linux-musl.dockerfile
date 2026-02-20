FROM node:24-alpine AS base

RUN apk add --no-cache --virtual .build-deps build-base make cmake gcc g++ python3

FROM base AS builder

WORKDIR /app
COPY ../ .

RUN npx node-pre-gyp configure --napi
RUN npx node-pre-gyp install --napi --fallback-to-build
RUN npx node-pre-gyp clean build package --napi

FROM scratch AS exporter

COPY --from=builder /app/lib /lib