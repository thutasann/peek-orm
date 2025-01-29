#include "./include/utils.h"
#include <node_api.h>

/** Init Maths functions */
void InitMathFunctions(napi_env env, napi_value exports) {
    napi_value addFn;

    napi_create_function(env, NULL, 0, Add, NULL, &addFn);
    napi_set_named_property(env, exports, "add", addFn);
}
