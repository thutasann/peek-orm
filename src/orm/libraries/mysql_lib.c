#include "../include/mysql_helper.h"

#include <mysql.h>
#include <node_api.h>
#include <stdio.h>
#include <stdlib.h>

MYSQL *conn;

/** Function to Connect to MySQL with Parameters */
napi_value ConnectMySQL(napi_env env, napi_callback_info info) {
    size_t argc = 4;
    napi_value args[4];
    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    if (argc < 4) {
        napi_throw_error(env, NULL, "Expected 4 arguments: host, user, password, database");
        return NULL;
    }

    char host[256], user[256], password[256], database[256];
    size_t str_len;

    napi_get_value_string_utf8(env, args[0], host, sizeof(host), &str_len);
    napi_get_value_string_utf8(env, args[1], user, sizeof(user), &str_len);
    napi_get_value_string_utf8(env, args[2], password, sizeof(password), &str_len);
    napi_get_value_string_utf8(env, args[3], database, sizeof(database), &str_len);

    conn = mysql_init(NULL);
    if (conn == NULL) {
        napi_throw_error(env, NULL, "MySQL init failed");
        return NULL;
    }

    if (mysql_real_connect(conn, host, user, password, database, 3306, NULL, 0) == NULL) {
        napi_throw_error(env, NULL, mysql_error(conn));
        mysql_close(conn);
        return NULL;
    }

    napi_value result;
    napi_get_boolean(env, 1, &result);
    return result;
}

napi_value CloseMySQL(napi_env env, napi_callback_info info) {
    if (conn) {
        mysql_close(conn);
        conn = NULL;
    }
    napi_value result;
    napi_get_boolean(env, 1, &result);
    return result;
}