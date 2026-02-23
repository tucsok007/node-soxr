import {
  deinterleaveChannelData,
  interleaveChannelData,
  SoxrQuality,
  SoxrWrapper,
} from "../node-soxr";
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

    return interleaveChannelData(...channels);
  };

  const inputSampleRate = 44100;
  const outputSampleRate = 22050;

  const audioBuffer = await getAudioBufferFromFileStream(
    createReadStream(__dirname + "/440-sine.wav"),
  );

  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

  new Promise((resolve) => {
    const soxr = new SoxrWrapper(
      inputSampleRate,
      outputSampleRate,
      audioBuffer.numberOfChannels,
      SoxrQuality.VERY_HIGH,
      4,
    );

    const inputData = getInterleavedChannelData(audioBuffer);
    const output = soxr.resample(inputData);
    soxr.destroy();

    resolve(deinterleaveChannelData(output, audioBuffer.numberOfChannels));
  }).then(console.log);

  console.log("This is logged first.");
})();
