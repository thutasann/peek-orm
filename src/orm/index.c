#include "./include/mysql_helper.h"
#include <node_api.h>

void InitMySQLFunctions(napi_env env, napi_value exports);

/** Module Initialization 🚀 */
napi_value Init(napi_env env, napi_value exports) {
    InitMySQLFunctions(env, exports);
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
