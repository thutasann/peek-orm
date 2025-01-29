#include "../include/utils.h"
#include <math.h>
#include <node_api.h>

/** Function to Add two Values */
napi_value Add(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value args[2];
    napi_value result;

    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    double value1, value2;
    napi_get_value_double(env, args[0], &value1);
    napi_get_value_double(env, args[1], &value2);

    double sum = value1 + value2;

    napi_create_double(env, sum, &result);
    return result;
}