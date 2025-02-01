#ifndef MYSQL_HELPER_H
#define MYSQL_HELPER_H

#include <node_api.h>

napi_value ConnectMySQL(napi_env env, napi_callback_info info);
napi_value CloseMySQL(napi_env env, napi_callback_info info);
napi_value CreateTable(napi_env env, napi_callback_info info);
napi_value Select(napi_env env, napi_callback_info info);
napi_value Initialize(napi_env env, napi_callback_info info);
napi_value Cleanup(napi_env env, napi_callback_info info);
napi_value Insert(napi_env env, napi_callback_info info);
napi_value Update(napi_env env, napi_callback_info info);

#endif
