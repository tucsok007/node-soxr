#include "napi.h"
#include <optional>
#include "../soxr/src/soxr.h"

enum class SoxrResampleQuality : unsigned long {
  QUICK_QUBIC = SOXR_QQ,
  LOW = SOXR_LQ,
  MEDIUM = SOXR_MQ,
  HIGH = SOXR_HQ,      
  VERY_HIGH = SOXR_VHQ,
};

class SoxrWrapper : public Napi::ObjectWrap<SoxrWrapper> {
  protected:
    soxr_t soxrInstance;
    double inputSampleRate;
    double outputSampleRate;
    uint32_t numberOfChannels;
  public:
    SoxrWrapper(const Napi::CallbackInfo &info);
    ~SoxrWrapper();
    static Napi::Object init(Napi::Env env, Napi::Object exports);
    Napi::Value resample(const Napi::CallbackInfo &info);
    Napi::Value destroy(const Napi::CallbackInfo &info);
};