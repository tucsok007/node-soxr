#include <napi.h>
#include <omp.h>
#include "../soxr/src/soxr.h"
#include "wrapper.h"
#include "utils.cc"

SoxrWrapper::SoxrWrapper(const Napi::CallbackInfo &info) : Napi::ObjectWrap<SoxrWrapper>(info) {
  Napi::Env env = info.Env();

  if(info.Length() < 3) {
    Napi::TypeError::New(env, "The first 3 parameters (inputSampleRate, outputSampleRate, numberOfChannels) must be provided.").ThrowAsJavaScriptException();
    return;
  }
  if(!info[0].IsNumber()) {
    Napi::TypeError::New(env, "The inputSampleRate argument must be a number.").ThrowAsJavaScriptException();
    return;
  }
  if(!info[1].IsNumber()) {
    Napi::TypeError::New(env, "The outputSampleRate argument must be a number.").ThrowAsJavaScriptException();
    return;
  }
  if(!info[2].IsNumber()) {
    Napi::TypeError::New(env, "The numberOfChannels argument must be a number.").ThrowAsJavaScriptException();
    return;
  }

  double inputSampleRate = info[0].As<Napi::Number>().DoubleValue();
  double outputSampleRate = info[1].As<Napi::Number>().DoubleValue();
  uint32_t numberOfChannels = info[2].As<Napi::Number>().Uint32Value();
  soxr_error_t error;
  soxr_io_spec_t const ioFormat = soxr_io_spec(SOXR_FLOAT32_I, SOXR_FLOAT32_I);
  soxr_quality_spec_t quality;
  soxr_runtime_spec_t runtime = soxr_runtime_spec(0);

  if(info.Length() > 3) {
    if(info[3].IsNull()) {
      quality = soxr_quality_spec(SOXR_VHQ, 0);
    } else if (info[3].IsNumber()) {
      unsigned long recipe = info[3].As<Napi::Number>().Uint32Value();
      quality = soxr_quality_spec(recipe, 0);
    } else {
      Napi::TypeError::New(env, "The quality parameter should be an SoxrQuality value or null.").ThrowAsJavaScriptException();
      return;
    }
  } else {
    quality = soxr_quality_spec(SOXR_VHQ, 0);
  }

  soxr_t instance = soxr_create(inputSampleRate, outputSampleRate, numberOfChannels, &error, &ioFormat, &quality, &runtime);

  if(!error) {
    this->inputSampleRate = inputSampleRate;
    this->outputSampleRate = outputSampleRate;
    this->numberOfChannels = numberOfChannels;
    this->soxrInstance = instance;
    this->isDestroyed = false;
  } else {
    Napi::Error::New(info.Env(), "Error while initializing the native SoxR instance.").ThrowAsJavaScriptException();
  }
};

SoxrWrapper::~SoxrWrapper() {
  if(!this->isDestroyed) {
    soxr_delete(this->soxrInstance);
  }
}

Napi::Object SoxrWrapper::init(Napi::Env env, Napi::Object exports) {
  Napi::Function func = DefineClass(env, "SoxrWrapper", {
    InstanceMethod<&SoxrWrapper::resample>("resample", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&SoxrWrapper::destroy>("destroy", static_cast<napi_property_attributes>(napi_writable | napi_configurable))
  });

  Napi::FunctionReference* constructor = new Napi::FunctionReference();

  *constructor = Napi::Persistent(func);
  exports.Set("SoxrWrapper", func);

  env.SetInstanceData<Napi::FunctionReference>(constructor);

  return exports;
}

Napi::Value SoxrWrapper::resample(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  if(info.Length() < 1 || !isFloat32Array(env, info[0])) {
    Napi::TypeError::New(env, "The interleavedChannelData parameter should be a Float32Array.").ThrowAsJavaScriptException();
    return env.Undefined();
  }

  Napi::Float32Array input = info[0].As<Napi::Float32Array>();
  size_t inputLength = input.ElementLength();
  size_t inputFrames = static_cast<size_t>(inputLength / this->numberOfChannels);
  std::vector<float> inputVector(inputLength);
  size_t inputDone;

  size_t outputFrames = static_cast<size_t>(inputFrames * this->outputSampleRate / this->inputSampleRate + 0.5);
  size_t outputLength = static_cast<size_t>(outputFrames * this->numberOfChannels);
  Napi::Float32Array output = Napi::Float32Array::New(env, outputLength);
  std::vector<float> outputVector(outputLength);
  size_t outputDone;

  soxr_error_t error;

  for(int index = 0; index < inputLength; index++) {
    inputVector[index] = input[index];
  }

  error = soxr_process(this->soxrInstance, inputVector.data(), inputFrames, &inputDone, outputVector.data(), outputFrames, &outputDone);

  //Flush remaining samples
  if(outputDone < outputFrames) {
    error = soxr_process(this->soxrInstance, NULL, 0, NULL, outputVector.data()+outputDone*this->numberOfChannels, outputFrames, NULL);
  }

  for(int index = 0; index < outputLength; index++) {
    output[index] = outputVector[index];
  }

  //De-allocate memory
  inputVector.clear();
  outputVector.clear();
  inputVector = std::vector<float>();
  outputVector = std::vector<float>();

  if(error) {
    Napi::Error::New(env, "A native error occurred while resampling the audio data.");
  } else {
    return output;
  }
}

Napi::Value SoxrWrapper::destroy(const Napi::CallbackInfo &info) {
  soxr_delete(this->soxrInstance);
  this->isDestroyed = true;

  return info.Env().Undefined();
}

Napi::Value setGlobalMaximumThreadCount(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  
  if(info.Length() < 1 || !info[0].IsNumber()) {
    Napi::TypeError::New(env, "The threadCount parameter should be a number.").ThrowAsJavaScriptException();
    return env.Undefined();
  }

  int threadCount = static_cast<int>(info[0].As<Napi::Number>().Uint32Value());

  omp_set_num_threads(threadCount);

  return env.Undefined();
}

Napi::Object registerStandaloneFunctions(Napi::Env env, Napi::Object exports) {
  exports.Set("setGlobalMaximumThreadCount", Napi::Function::New(env, setGlobalMaximumThreadCount));

  return exports;
}

Napi::Object init (Napi::Env env, Napi::Object exports) {
  //Register exports
  SoxrWrapper::init(env, exports);
  registerStandaloneFunctions(env, exports);

  //Set global flags
  omp_set_dynamic(0);

  return exports;
}

NODE_API_MODULE('node-soxr', init);