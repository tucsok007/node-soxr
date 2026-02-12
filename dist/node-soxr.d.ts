interface SoxrWrapper {
    /** Resamples the provided interleaved channel data with the resampler.
     *
     * @param interleavedChannelData - Interleaved channel data.
     * @returns Resampled interleaved channel data.
     */
    resample(interleavedChannelData: Float32Array<ArrayBuffer>): Float32Array<ArrayBuffer>;
    /** Destroys the SoxR instance, frees memory.*/
    destroy(): void;
}
export declare enum SoxrQuality {
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
    VERY_HIGH_32 = 7
}
/** Node SoxR wrapper class. */
export declare const SoxrWrapper: {
    /** Creates an SoxR wrapper instance.
     *
     * @param inputSampleRate - Sample rate of the input data.
     * @param outputSampleRate - Sample rate of the output data.
     * @param numberOfChannels - Number of channels to process.
     * @param quality - Quality identifier for processing. See SoxrQuality for details about individual quality settings. (Default: VERY_HIGH)
     * @param numberOfThreads - Number of threads to utilize for multi-thread processing. (Default: undefined => no multi-threading)
     */
    new (inputSampleRate: number, outputSampleRate: number, numberOfChannels: number, quality?: SoxrQuality, numberOfThreads?: number): SoxrWrapper;
};
/** Manually force-call the global garbage collector which will call the object destructors in C++. */
export declare const soxrCleanup: () => void;
/** Interleaves the provided channels.
 *
 * @param channels - An array of Float32Array<ArrayBufferLike> channel data.
 * @returns Interleaved Float32Array<ArrayBuffer> channel data.
 */
export declare const interleaveChannelData: (...channels: Float32Array[]) => Float32Array<ArrayBuffer>;
/** Deinterleaves the provided channel data based on the number of channels.
 *
 * @param data - Interleaved Float32Array<ArrayBufferLike> channel data.
 * @param numberOfChannels - The number of channels.
 * @returns Deinterleaved Float32Array<ArrayBufferLike>[] channel data.
 */
export declare const deinterleaveChannelData: (data: Float32Array, numberOfChannels: number) => Float32Array[];
export {};
