# Node-Soxr

[![npm-tag](https://img.shields.io/badge/npm-1.0.0-green?logo=npm)](https://www.npmjs.com/package/node-soxr) [![git-tag](https://img.shields.io/badge/github-repo-blue?logo=github)](https://github.com/tucsok007/node-soxr)

Node.js native addon wrapper for libsoxr (high quality and high performance offline audio resampler).

---

## Installation

#### Requirements:

- OpenMP runtime

  _*(Pre-built binaries for Linux systems are linked with GCC's OpenMP runtime (libgomp1), Windows and Mac is configured to link LLVM's OpenMP runtime by default. - If you would like to use a different OpenMP library, please edit the linker flags in the binding.gyp file accordingly.)*_

- npm
- Node.js >= 24 (Binaries are built on LTS node. Please rebuild from source manually if you want to target older node versions.)

#### Setup:

1. Install with npm:

   ```sh
   npm i node-soxr
   ```

   **_Note: the npm package includes pre-built binaries for Linux (incl. builds for all architectures supported by LTS Node.js), Alpine containers (all Node.js LTS supported architectures), and Windows (x64 only). For different operating systems and architectures (ex. darwin - MacOS) please make sure to install the necessary build tools on your system so the corresponding binaries can be built on your system at install time. If the required build tools are missing install will fail._**

## Usage:

### General usage:

```typescript
import { SoxrWrapper, SoxrQuality } from "node-soxr";

const soxr = new SoxrWrapper(48000, 44100, 2);
const resampledData = soxr.resample(data);
soxr.destroy();
```

### With multi-threading enabled:

```typescript
import * as NodeSoxr from "node-soxr";

const maxThreads = 8;
//Call this once to set the global limit - desirably on your module init
NodeSoxr.setGlobalMaximumThreadCount(maxThreads);

const soxr = new NodeSoxr.SoxrWrapper(48000, 44100, 2);
const resampledData = soxr.resample(data);
soxr.destroy();
```

### Using utility functions:

```typescript
import * as NodeSoxr from "node-soxr";

const inputSampleRate = 48000;
const outputSampleRate = 44100;
const numberOfAudioChannels = 5;

const soxr = new NodeSoxr.SoxrWrapper(
  inputSampleRate,
  outputSampleRate,
  numberOfAudioChannels,
  NodeSoxr.SoxrQuality.HIGH_16,
);

const inputData = NodeSoxr.interleaveChannelData(...channelDataArray);
const resampledData = soxr.resample(inputData);
const outputData = NodeSoxr.deinterleaveChannelData(
  resampledData,
  numberOfAudioChannels,
);

soxr.destroy();
```

[For more extensive examples please click here.](examples/)

###### At the moment only CBR resampling is supported. (This might not change.)

## Building manually:

To build the library you may run `npm run build`, or use the provided shell script to manually build the library (`sh ./build.sh`). To see details about the flags that can be used with the build script please run `sh ./build.sh -h` or `sh ./build.sh --help`.

#### Dependencies:

- Python3
- C/C++ build tools (installing through the Node.js installer is recommended)
- An OpenMP runtime:
  - on Windows it's shipped with MSVC,
  - on Mac please use `brew install libomp`,
  - on Linux please use `sudo apt update && sudo apt install libgomp1`,
  - for other environments please use your desired OpenMP runtime and change the linker flags in the [`binding.gyp`](binding.gyp) file if needed.

## Contributions:

The C++ standard used for this project is C++ 17.

All contributions are welcome. In order to contribute, please make a fork of this project and make a pull request to the main branch of this project once you added your changes.

## Licensing/Credits:

This library is a wrapper built on top of the source code of the [SoX Resampler Library](https://github.com/chirlu/soxr).

This project is licensed under the terms of the [LGPL 2.1](LICENCE) - see the [LICENSE](LICENCE) file for details.

For additional credits/licensing please refer to the notes section in the [LICENSE](LICENCE).

---
