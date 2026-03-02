const NodeSoxr = require("node-gyp-build")(__dirname);

interface SoxrWrapper {
  /** Resamples the provided interleaved channel data with the resampler.
   *
   * @param interleavedChannelData - Interleaved channel data.
   * @returns Resampled interleaved channel data.
   */
  resample(
    interleavedChannelData: Float32Array<ArrayBuffer>,
  ): Float32Array<ArrayBuffer>;
  /** Destroys the SoxR instance, frees memory.*/
  destroy(): void;
}

export enum SoxrQuality {
  /** 'Quick' qubic interpolation. */
  QUICK_QUBIC = 0,
  /** The standard low quality option in SoxR. Uses 16 bit processing with larger rolloff. */
  LOW = 1,
  /** The standard medium quality option in SoxR. Uses 16 bit processing with medium rolloff.  */
  MEDIUM = 2,
  /** HIGH is the standard option for high quality processing in SoxR. Use this option if you want 16 bit processing instead of 20.  */
  HIGH_16 = 3,
  /** The standard high quality option in SoxR. Uses 20 bit processing.  */
  HIGH = 4,
  /** HIGH is the standard option for high quality processing in SoxR. Use this option if you want 24 bit processing instead of 20.  */
  HIGH_24 = 5,
  /** The highest standard quality in SoxR. Uses 28 bit processing.  */
  VERY_HIGH = 6,
  /** VERY_HIGH is the highest option in SoxR by default. Use this option if you want 32 bit processing instead of 28. */
  VERY_HIGH_32 = 7,
}

/** Node SoxR wrapper class. */
export const SoxrWrapper: {
  /** Creates an SoxR wrapper instance.
   *
   * @param inputSampleRate - Sample rate of the input data.
   * @param outputSampleRate - Sample rate of the output data.
   * @param numberOfChannels - Number of channels to process.
   * @param quality - Quality identifier for processing. See SoxrQuality for details about individual quality settings. (Default: VERY_HIGH)
   *
   * Note: the number of threads spawned will not exceed the number of channels that are being processed in parallel (during the processing phases in libsoxr). During data transformation phases or additional under the hood mechanisms separate from the actual resampling of the input values the library may utilize the maxmimum number of threads even if the number of channels are less than the maximum number of threads allowed.
   *
   * @example
   * const nodeSoxr = new SoxrWrapper(44100, 22500, 2, SoxrQuality.HIGH_16, 2);
   */
  new (
    inputSampleRate: number,
    outputSampleRate: number,
    numberOfChannels: number,
    quality?: SoxrQuality,
  ): SoxrWrapper;
} = NodeSoxr.SoxrWrapper;

//Utility functions

/**Sets the number of maximum threads globally.
 *
 * @param threadCount - The maximum number of threads that can be utilized by all instances (running in parallel).
 */
export const setGlobalMaximumThreadCount =
  NodeSoxr.setGlobalMaximumThreadCount as (threadCount: number) => void;

/** Manually force-call the global garbage collector which will call the object destructors in C++. */
export const soxrCleanup = () => {
  if (global.gc) {
    global.gc();
  }
};

/** Interleaves the provided channels.
 *
 * @param channels - An array of Float32Array<ArrayBufferLike> channel data.
 * @returns Interleaved Float32Array<ArrayBuffer> channel data.
 */
export const interleaveChannelData = (...channels: Float32Array[]) => {
  if (
    !channels ||
    channels.length < 2 ||
    !channels.every((channel) => channel instanceof Float32Array)
  ) {
    throw new TypeError(
      "Please provide more than 1 channels' Float32Array data to interleave them.",
    );
  }

  const channelLength = channels[0].length;
  const numberOfChannels = channels.length;
  const result = new Float32Array(channelLength * numberOfChannels);

  for (let frame = 0; frame < channelLength; frame++) {
    for (let channelIndex = 0; channelIndex < channels.length; channelIndex++) {
      result[frame * channels.length + channelIndex] =
        channels[channelIndex][frame];
    }
  }

  return result;
};

/** Deinterleaves the provided channel data based on the number of channels.
 *
 * @param data - Interleaved Float32Array<ArrayBufferLike> channel data.
 * @param numberOfChannels - The number of channels.
 * @returns Deinterleaved Float32Array<ArrayBufferLike>[] channel data.
 */
export const deinterleaveChannelData = (
  data: Float32Array,
  numberOfChannels: number,
): Float32Array[] => {
  if (!data || !(data instanceof Float32Array)) {
    throw new TypeError("The data parameter must be a Float32Array.");
  }
  if (!numberOfChannels || numberOfChannels <= 1) {
    throw new TypeError(
      "The number of channels has to be greater than 1 to deinterleave the channel data.",
    );
  }
  if (data.length % numberOfChannels !== 0) {
    throw new TypeError(
      "The length of the provided interleaved channel data doesn't correspond to the value of numberOfChannels.",
    );
  }

  const channelLength = data.length / numberOfChannels;
  const result: Float32Array[] = [];

  for (let channelIndex = 0; channelIndex < numberOfChannels; channelIndex++) {
    const channelData = new Float32Array(channelLength);
    for (let frame = 0; frame < channelLength; frame++) {
      channelData[frame] = data[frame * numberOfChannels + channelIndex];
    }
    result.push(channelData);
  }

  return result;
};
