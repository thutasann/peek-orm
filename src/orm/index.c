#include "./include/utils.h"
#include <node_api.h>

void InitMathFunctions(napi_env env, napi_value exports);
void InitMySQLFunctions(napi_env env, napi_value exports);

/** Module Initialization 🚀 */
napi_value Init(napi_env env, napi_value exports) {
    InitMathFunctions(env, exports);
    InitMySQLFunctions(env, exports);
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
