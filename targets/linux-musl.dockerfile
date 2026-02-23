FROM node:24-alpine AS base

RUN apk add --no-cache --virtual .build-deps build-base make cmake gcc g++ python3 libgomp

WORKDIR /app
COPY ../ .

RUN npm run install-ci

FROM base AS builder

RUN npx prebuildify --napi --platform linux --libc musl --tag-libc

FROM scratch AS exporter

COPY --from=builder /app/prebuilds /prebuilds