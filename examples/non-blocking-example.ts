import NodeSoxr from "../node-soxr";
import { createReadStream, ReadStream } from "node:fs";
import { AudioContext } from "node-web-audio-api";
import { arrayBuffer } from "node:stream/consumers";

(async () => {
  console.log("Current pid:", process.pid);

  const audioContext = new AudioContext();

  const getAudioBufferFromFileStream = async (fileStream: ReadStream) => {
    return await audioContext.decodeAudioData(await arrayBuffer(fileStream));
  };

  const getInterleavedChannelData = (audioBuffer: AudioBuffer) => {
    const channels: Float32Array<ArrayBuffer>[] = [];

    for (
      let channelIndex = 0;
      channelIndex < audioBuffer.numberOfChannels;
      channelIndex++
    ) {
      channels.push(audioBuffer.getChannelData(channelIndex));
    }

    return NodeSoxr.interleaveChannelData(...channels);
  };

  const inputSampleRate = 44100;
  const outputSampleRate = 22050;

  const audioBuffer = await getAudioBufferFromFileStream(
    createReadStream(__dirname + "/440-sine.wav"),
  );

  NodeSoxr.setGlobalMaximumThreadCount(4);

  const resample = () => {
    const soxr = new NodeSoxr.SoxrWrapper(
      inputSampleRate,
      outputSampleRate,
      audioBuffer.numberOfChannels,
      NodeSoxr.SoxrQuality.VERY_HIGH,
    );

    const inputData = getInterleavedChannelData(audioBuffer);
    const output = soxr.resample(inputData);
    soxr.destroy();

    return NodeSoxr.deinterleaveChannelData(
      output,
      audioBuffer.numberOfChannels,
    );
  };

  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

  //An example that spawns multiple instances in parallel
  Promise.all([
    new Promise((resolve) => {
      resolve(resample());
    }),
    new Promise((resolve) => {
      resolve(resample());
    }),
    new Promise((resolve) => {
      resolve(resample());
    }),
    new Promise((resolve) => {
      resolve(resample());
    }),
    new Promise((resolve) => {
      resolve(resample());
    }),
    new Promise((resolve) => {
      resolve(resample());
    }),
    new Promise((resolve) => {
      resolve(resample());
    }),
  ]).then(console.log);

  console.log("This is logged first.");
})();
