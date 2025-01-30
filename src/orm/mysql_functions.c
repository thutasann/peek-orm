#include "./include/mysql_helper.h"
#include <node_api.h>

/** Init MySQL functions */
void InitMySQLFunctions(napi_env env, napi_value exports) {
    napi_value connectFn, closeFn, createTableFn, selectFn;

    napi_create_function(env, NULL, 0, ConnectMySQL, NULL, &connectFn);
    napi_set_named_property(env, exports, "connectMySQL", connectFn);

    napi_create_function(env, NULL, 0, CloseMySQL, NULL, &closeFn);
    napi_set_named_property(env, exports, "closeMySQL", closeFn);

    napi_create_function(env, NULL, 0, CreateTable, NULL, &createTableFn);
    napi_set_named_property(env, exports, "createTable", createTableFn);

    napi_create_function(env, NULL, 0, Select, NULL, &selectFn);
    napi_set_named_property(env, exports, "select", selectFn);
}