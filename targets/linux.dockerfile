FROM node:24-slim AS base

RUN apt update
RUN apt install build-essential make cmake gcc g++ python3 libgomp1 -y

WORKDIR /app
COPY ../ .

RUN npm run install-ci

FROM base AS builder

ARG PLATFORM=linux
RUN npx prebuildify --napi --platform ${PLATFORM} --tag-libc

FROM scratch AS exporter

COPY --from=builder /app/prebuilds /prebuilds