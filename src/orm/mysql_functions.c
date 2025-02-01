#include "./include/mysql_helper.h"
#include <node_api.h>

/** Init MySQL functions */
void InitMySQLFunctions(napi_env env, napi_value exports) {
    napi_value connectFn, closeFn, createTableFn, selectFn, initializeFn, cleanupFn, insertFn, updateFn, deleteFn;

    napi_create_function(env, NULL, 0, ConnectMySQL, NULL, &connectFn);
    napi_set_named_property(env, exports, "connectMySQL", connectFn);

    napi_create_function(env, NULL, 0, CloseMySQL, NULL, &closeFn);
    napi_set_named_property(env, exports, "closeMySQL", closeFn);

    napi_create_function(env, NULL, 0, CreateTable, NULL, &createTableFn);
    napi_set_named_property(env, exports, "createTable", createTableFn);

    napi_create_function(env, NULL, 0, Select, NULL, &selectFn);
    napi_set_named_property(env, exports, "select", selectFn);

    napi_create_function(env, NULL, 0, Initialize, NULL, &initializeFn);
    napi_set_named_property(env, exports, "initialize", initializeFn);

    napi_create_function(env, NULL, 0, Cleanup, NULL, &cleanupFn);
    napi_set_named_property(env, exports, "cleanup", cleanupFn);

    napi_create_function(env, NULL, 0, Insert, NULL, &insertFn);
    napi_set_named_property(env, exports, "insert", insertFn);

    napi_create_function(env, NULL, 0, Update, NULL, &updateFn);
    napi_set_named_property(env, exports, "update", updateFn);

    napi_create_function(env, NULL, 0, Delete, NULL, &deleteFn);
    napi_set_named_property(env, exports, "deleteQuery", deleteFn);
}
