# Node-SoxR

Node.js native addon wrapper for libsoxr (high quality and high performance offline audio resampler).

---

## Installation

#### Requirements:

- npm
- Node.js >= 24 (Binaries are built on LTS node. Please rebuild from source manually if you want to target older node versions.)

#### Setup:

1. Install with npm:

   ```sh
   npm i node-soxr
   ```

   **_Note: the npm package includes pre-built binaries for Linux (incl. builds for all architectures supported by LTS Node.js), Alipne containers (all Node.js LTS supported architectures), and Windows (x64 only). For different operating systems and architectures (ex. darwin - MacOS) please make sure to install the necessary build tools on your system so the corresponding binaries can be built on your system at install time. If the required build tools are missing install will fail._**

## Usage:

```typescript
import { SoxrWrapper, SoxrQuality } from "node-soxr";

const soxr = new SoxrWrapper(48000, 44100, 2);
const resampledData = soxr.resample(data);
```

[You can find an in depth example here regarding how you can utilize the library in a real-world scenario.](examples/example.ts)

###### At the moment only CBR resampling is supported. (This might not change.)

## Contributions:

The C++ standard used for this project is C++ 17.

All contributions are welcome. In order to contribute, please make a fork of this project and make a pull request to the main branch of this project once you added your changes.

Please make sure to use the same major and minor versions as the corresponding SoxR version - this way users can easily understand which SoxR version is embedded in this wrapper. (Use the patch version for changes to the same minor version.)

## Licensing/Credits:

This library is wrapper built on top of the source code of the [Sox Resampler Library](https://github.com/chirlu/soxr).

This project is licensed under the terms of the [LGPL 2.1](LICENCE) - see the [LICENSE](LICENCE) file for details.

For additional credits/licensing please refer to the notes section in the [LICENSE](LICENCE).

---
