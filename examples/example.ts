import * as NodeSoxr from "../node-soxr";
import { createReadStream, ReadStream } from "node:fs";
import { AudioContext } from "node-web-audio-api";
import { arrayBuffer } from "node:stream/consumers";

(async () => {
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
  const soxr = new NodeSoxr.SoxrWrapper(
    inputSampleRate,
    outputSampleRate,
    audioBuffer.numberOfChannels,
    NodeSoxr.SoxrQuality.VERY_HIGH,
  );

  NodeSoxr.setGlobalMaximumThreadCount(4);
  const inputData = getInterleavedChannelData(audioBuffer);
  const output = soxr.resample(inputData);
  soxr.destroy();

  console.log(
    NodeSoxr.deinterleaveChannelData(output, audioBuffer.numberOfChannels),
  );
})();
