#include <napi.h>

bool isFloat32Array(Napi::Env env, Napi::Value value) {
  if(!value.IsTypedArray()) return false;

  napi_typedarray_type type;
  napi_status status = napi_get_typedarray_info(env, value, &type, nullptr, nullptr, nullptr, nullptr);

  return status == napi_ok && type == napi_float32_array;
}