"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deinterleaveChannelData = exports.interleaveChannelData = exports.soxrCleanup = exports.SoxrWrapper = exports.SoxrQuality = void 0;
const nodePreGyp = require("@mapbox/node-pre-gyp");
const path = require("path");
const bindingPath = nodePreGyp.find(path.resolve(path.join(__dirname, "../package.json")));
const NodeSoxr = require(bindingPath);
var SoxrQuality;
(function (SoxrQuality) {
    /** 'Quick' qubic interpolation. */
    SoxrQuality[SoxrQuality["QUICK_QUBIC"] = 0] = "QUICK_QUBIC";
    /** The standard low quality option in SoxR. Uses 16 bit processing with larger rolloff. */
    SoxrQuality[SoxrQuality["LOW"] = 1] = "LOW";
    /** The standard medium quality option in SoxR. Uses 16 bit processing with medium rolloff.  */
    SoxrQuality[SoxrQuality["MEDIUM"] = 2] = "MEDIUM";
    /** HIGH is the standard option for high quality processing in SoxR. Use this option if you want 16 bit processing instead of 20.  */
    SoxrQuality[SoxrQuality["HIGH_16"] = 3] = "HIGH_16";
    /** The standard high quality option in SoxR. Uses 20 bit processing.  */
    SoxrQuality[SoxrQuality["HIGH"] = 4] = "HIGH";
    /** HIGH is the standard option for high quality processing in SoxR. Use this option if you want 24 bit processing instead of 20.  */
    SoxrQuality[SoxrQuality["HIGH_24"] = 5] = "HIGH_24";
    /** The highest standard quality in SoxR. Uses 28 bit processing.  */
    SoxrQuality[SoxrQuality["VERY_HIGH"] = 6] = "VERY_HIGH";
    /** VERY_HIGH is the highest option in SoxR by default. Use this option if you want 32 bit processing instead of 28. */
    SoxrQuality[SoxrQuality["VERY_HIGH_32"] = 7] = "VERY_HIGH_32";
})(SoxrQuality || (exports.SoxrQuality = SoxrQuality = {}));
/** Node SoxR wrapper class. */
exports.SoxrWrapper = NodeSoxr.SoxrWrapper;
//Utility functions
/** Manually force-call the global garbage collector which will call the object destructors in C++. */
const soxrCleanup = () => {
    if (global.gc) {
        global.gc();
    }
};
exports.soxrCleanup = soxrCleanup;
/** Interleaves the provided channels.
 *
 * @param channels - An array of Float32Array<ArrayBufferLike> channel data.
 * @returns Interleaved Float32Array<ArrayBuffer> channel data.
 */
const interleaveChannelData = (...channels) => {
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
exports.interleaveChannelData = interleaveChannelData;
/** Deinterleaves the provided channel data based on the number of channels.
 *
 * @param data - Interleaved Float32Array<ArrayBufferLike> channel data.
 * @param numberOfChannels - The number of channels.
 * @returns Deinterleaved Float32Array<ArrayBufferLike>[] channel data.
 */
const deinterleaveChannelData = (data, numberOfChannels) => {
    const channelLength = data.length / numberOfChannels;
    const result = [];
    for (let channelIndex = 0; channelIndex < numberOfChannels; channelIndex++) {
        const channelData = new Float32Array(channelLength);
        for (let frame = 0; frame < channelLength; frame++) {
            channelData[frame] = data[frame * numberOfChannels + channelIndex];
        }
        result.push(channelData);
    }
    return result;
};
exports.deinterleaveChannelData = deinterleaveChannelData;
