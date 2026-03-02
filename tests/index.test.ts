import * as NodeSoxr from "../node-soxr";
import { createSineWave } from "./test-utils";

describe("NodeSoxr module", () => {
  afterEach(() => {
    NodeSoxr.soxrCleanup();
  });

  it("should import without crashing", () => {
    require("../node-soxr");
  });

  describe("SoxrWrapper class", () => {
    describe("construction", () => {
      it("should throw a TypeError on SoxrWrapper construction if less than 3 arguments are provided", () => {
        const factory = () => {
          return new (NodeSoxr as any).SoxrWrapper(48000, 44100);
        };
        const message =
          "The first 3 parameters (inputSampleRate, outputSampleRate, numberOfChannels) must be provided.";

        expect(factory).toThrow(message);
      });

      it("should throw a TypeError if the inputSampleRate parameter is not a number", () => {
        const factory = () => {
          return new (NodeSoxr as any).SoxrWrapper("a", 44100, 2);
        };

        expect(factory).toThrow(
          "The inputSampleRate argument must be a number.",
        );
      });

      it("should throw a TypeError if the outputSampleRate parameter is not a number", () => {
        const factory = () => {
          return new (NodeSoxr as any).SoxrWrapper(7, "a", 2);
        };

        expect(factory).toThrow(
          "The outputSampleRate argument must be a number.",
        );
      });

      it("should throw a TypeError if the numberOfChannels parameter is not a number", () => {
        const factory = () => {
          return new (NodeSoxr as any).SoxrWrapper(3, 44100, "a");
        };

        expect(factory).toThrow(
          "The numberOfChannels argument must be a number.",
        );
      });

      it("should throw a TypeError if the quality parameter is not a number or null", () => {
        const factory = () => {
          return new (NodeSoxr as any).SoxrWrapper(48000, 44100, 2, "y");
        };

        expect(factory).toThrow(
          "The quality parameter should be an SoxrQuality value or null.",
        );
      });

      it("should be able to create a new SoxrWrapper instance when the quality argument is missing", () => {
        const soxr = new NodeSoxr.SoxrWrapper(48000, 44100, 2);
        expect(soxr).toBeInstanceOf(NodeSoxr.SoxrWrapper);
        soxr.destroy();
      });

      it.each(
        Object.keys(NodeSoxr.SoxrQuality).filter((key) =>
          isNaN(Number(key)),
        ) as [keyof typeof NodeSoxr.SoxrQuality],
      )(
        "should be able to create an SoxrWrapper instance with %s quality",
        (qualityKey) => {
          const soxr = new NodeSoxr.SoxrWrapper(
            48000,
            44100,
            2,
            NodeSoxr.SoxrQuality[qualityKey],
          );
          expect(soxr).toBeInstanceOf(NodeSoxr.SoxrWrapper);
          soxr.destroy();
        },
      );

      it("should be able to create an SoxrWrapper instance with null quality", () => {
        const soxr = new (NodeSoxr as any).SoxrWrapper(48000, 44100, 2, null);
        expect(soxr).toBeInstanceOf(NodeSoxr.SoxrWrapper);
        soxr.destroy();
      });
    });

    describe("resampling", () => {
      it("should throw a TypeError if the interleavedChannelData is not provided during resampling", () => {
        const resampling = () => {
          const soxr = new NodeSoxr.SoxrWrapper(44100, 22500, 1);

          const resampledData = (soxr as any).resample();
          soxr.destroy();

          return resampledData;
        };

        expect(resampling).toThrow(
          "The interleavedChannelData parameter should be a Float32Array.",
        );
      });

      it("should throw a TypeError if the interleavedChannelData is not a Float32Array", () => {
        const resampling = () => {
          const soxr = new NodeSoxr.SoxrWrapper(44100, 22500, 1);
          const monoSine: Float16Array<ArrayBuffer> = Float16Array.from(
            createSineWave(440),
          );

          const resampledData = (soxr as any).resample(monoSine);
          soxr.destroy();

          return resampledData;
        };

        expect(resampling).toThrow(
          "The interleavedChannelData parameter should be a Float32Array.",
        );
      });

      it("should return resampled data with length according to the resampling ratio", () => {
        const inputSampleRate = 44100;
        const outputSampleRate = 43298;
        const ratio = outputSampleRate / inputSampleRate;

        const monoSine: Float32Array<ArrayBuffer> = Float32Array.from(
          createSineWave(440),
        );

        const soxr = new NodeSoxr.SoxrWrapper(
          inputSampleRate,
          outputSampleRate,
          1,
        );
        const resampledData = soxr.resample(monoSine);
        soxr.destroy();

        expect(resampledData.length).toBe(Math.ceil(monoSine.length * ratio));
      });

      it("should return non-empty resampled data", () => {
        const inputSampleRate = 44100;
        const outputSampleRate = 22500;

        const monoSine: Float32Array<ArrayBuffer> = Float32Array.from(
          createSineWave(440, 90),
        );

        const soxr = new NodeSoxr.SoxrWrapper(
          inputSampleRate,
          outputSampleRate,
          1,
        );
        const resampledData = soxr.resample(monoSine);
        soxr.destroy();

        expect(resampledData[resampledData.length - 1]).not.toBe(0);
      });
    });
  });

  describe("Utility functions", () => {
    describe("setGlobalMaximumThreadCount", () => {
      it("should throw a TypeError while setting the global maximum thread count if the thread count is not provided", () => {
        const setter = () => (NodeSoxr as any).setGlobalMaximumThreadCount();

        expect(setter).toThrow("The threadCount parameter should be a number.");
      });

      it("should be able to set the global maximum thread count without an issue", () => {
        NodeSoxr.setGlobalMaximumThreadCount(2);
      });
    });

    describe("interleaveChannelData", () => {
      it("should throw a TypeError if no channel data is provided", () => {
        const interleave = () => {
          return NodeSoxr.interleaveChannelData();
        };

        expect(interleave).toThrow(
          "Please provide more than 1 channels' Float32Array data to interleave them.",
        );
      });

      it("should throw a TypeError if only one channel data is provided", () => {
        const interleave = () => {
          const monoSine = Float32Array.from(createSineWave(12));

          return NodeSoxr.interleaveChannelData(monoSine);
        };

        expect(interleave).toThrow(
          "Please provide more than 1 channels' Float32Array data to interleave them.",
        );
      });

      it("should throw a TypeError if any of the provided channels' data is not a Float32Array", () => {
        const interleave = () => {
          const monoSine32 = Float32Array.from(createSineWave(12));
          const monoSine16 = Float16Array.from(createSineWave(12));

          return (NodeSoxr as any).interleaveChannelData(
            monoSine32,
            monoSine16,
          );
        };

        expect(interleave).toThrow(
          "Please provide more than 1 channels' Float32Array data to interleave them.",
        );
      });

      it("should interleave the channels' data if 2 or more channels are provided", () => {
        const monoSine = Float32Array.from(createSineWave(12));
        const channels = [monoSine, monoSine];

        const stereoChannelData = NodeSoxr.interleaveChannelData(...channels);

        expect(stereoChannelData.length % channels.length).toBe(0);
      });
    });

    describe("deinterleaveChannelData", () => {
      it("should throw a TypeError if no channel data is provided", () => {
        const deinterleave = () => {
          return (NodeSoxr as any).deinterleaveChannelData();
        };

        expect(deinterleave).toThrow(
          "The data parameter must be a Float32Array.",
        );
      });

      it("should throw a TypeError if the provided channel data is not a Float32Array", () => {
        const deinterleave = () => {
          const stereoSine = Float16Array.from([0, 0, 1, 1, 0, 0, -1, -1]);

          return (NodeSoxr as any).deinterleaveChannelData(stereoSine);
        };

        expect(deinterleave).toThrow(
          "The data parameter must be a Float32Array.",
        );
      });

      it("should throw a TypeError if the numberOfChannels is less than two", () => {
        const deinterleave = () => {
          const monoSine = Float32Array.from([0, 1, 0, -1]);

          return NodeSoxr.deinterleaveChannelData(monoSine, 1);
        };

        expect(deinterleave).toThrow(
          "The number of channels has to be greater than 1 to deinterleave the channel data.",
        );
      });

      it("should throw a TypeError if there is a mismatch between the length of the provided data and the number of channels", () => {
        const deinterleave = () => {
          const partialMonoSine = Float32Array.from([0, 1, 0, -1, 0]);

          return NodeSoxr.deinterleaveChannelData(partialMonoSine, 2);
        };

        expect(deinterleave).toThrow(
          "The length of the provided interleaved channel data doesn't correspond to the value of numberOfChannels.",
        );
      });

      it("should deinterleave the channel data if 2 or more channels and their interleaved channel data are provided", () => {
        const interleavedChannelData = Float32Array.from([
          0, 0, 1, 1, 0, 0, -1, -1,
        ]);
        const numberOfChannels = 2;

        const deinterleaveChannelData = NodeSoxr.deinterleaveChannelData(
          interleavedChannelData,
          numberOfChannels,
        );

        expect(deinterleaveChannelData.length).toBe(numberOfChannels);
      });
    });

    describe("soxrCleanup", () => {
      it("should call the global garbage collector", () => {
        global.gc = jest.fn();

        NodeSoxr.soxrCleanup();

        expect(global.gc).toHaveBeenCalledTimes(1);
      });
    });
  });
});
