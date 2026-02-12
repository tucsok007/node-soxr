# Node-SoxR

Node.js native addon wrapper for libsoxr (high quality and high performance offline audio resampler).

---

## Installation

#### Requirements:

- Node.js >= 24 (Binaries are built on LTS node. Please rebuild from source manually if you want a different node target.)

#### Setup:

Right now only manual setup is supported. Please see build for pre-built windows binaries and dist for the JavaScript & TypeScript lib. (ESM supported.)

1. (Optional) build the binaries on your target system (or cross-compile with [node-gyp](https://github.com/nodejs/node-gyp)):

   ```sh
   npm i && npm run build
   ```

2. Copy the dist and build folders to your project (make sure they are at the same level in the hierarchy).

3. Import the library from dist/node-soxr.

## Usage:

```typescript
import { SoxrWrapper, SoxrQuality } from "node-soxr";

const soxr = new SoxrWrapper(48000, 44100, 2);
const resampledData = soxr.resample(data);
```

[You can find an in depth example here regarding how you can utilize the library in a real-world scenario.](examples/example.ts)

###### At the moment only CBR resampling is supported. (This might not change.)

## Licensing/Credits:

This library is wrapper built on top of the source code of the [Sox Resampler Library](https://github.com/chirlu/soxr).

This project is licensed under the terms of the [LGPL 2.1](LICENCE) - see the [LICENSE](LICENCE) file for details.

For additional credits/licensing please refer to the notes section in the [LICENSE](LICENCE).

---
