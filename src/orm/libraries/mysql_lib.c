#include "../include/mysql_helper.h"

#include <ctype.h>
#include <mysql.h>
#include <node_api.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

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

/** Function to Close MySQL Connection */
napi_value CloseMySQL(napi_env env, napi_callback_info info) {
    if (conn) {
        mysql_close(conn);
        conn = NULL;
    }
    napi_value result;
    napi_get_boolean(env, 1, &result);
    return result;
}

/** Function to Create or Update Table */
napi_value CreateTable(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value args[2];
    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    char table_name[256];
    size_t table_name_len;
    napi_get_value_string_utf8(env, args[0], table_name, sizeof(table_name), &table_name_len);

    char new_columns[2048];
    size_t new_columns_len;
    napi_get_value_string_utf8(env, args[1], new_columns, sizeof(new_columns), &new_columns_len);

    char query[512];
    snprintf(query, sizeof(query), "SHOW TABLES LIKE '%s'", table_name);
    if (mysql_query(conn, query)) {
        napi_throw_error(env, NULL, mysql_error(conn));
        return NULL;
    }

    MYSQL_RES *result = mysql_store_result(conn);
    int table_exists = mysql_num_rows(result) > 0;
    mysql_free_result(result);

    if (!table_exists) {
        char create_query[4096];
        snprintf(create_query, sizeof(create_query), "CREATE TABLE %s (%s)", table_name, new_columns);
        if (mysql_query(conn, create_query)) {
            napi_throw_error(env, NULL, mysql_error(conn));
            return NULL;
        }
    } else {
        snprintf(query, sizeof(query), "SHOW COLUMNS FROM %s", table_name);
        if (mysql_query(conn, query)) {
            napi_throw_error(env, NULL, mysql_error(conn));
            return NULL;
        }

        result = mysql_store_result(conn);
        char existing_columns[2048] = "";
        MYSQL_ROW row;
        while ((row = mysql_fetch_row(result))) {
            strcat(existing_columns, row[0]);
            strcat(existing_columns, ",");
        }
        mysql_free_result(result);

        // Add missing columns and track which ones exist
        char *token = strtok(new_columns, ",");
        char columns_to_keep[2048] = "";
        while (token != NULL) {
            char column[256];
            strncpy(column, token, sizeof(column) - 1);
            column[sizeof(column) - 1] = '\0';

            char column_name[256];
            sscanf(column, "%255s", column_name);

            if (!strstr(existing_columns, column_name)) {
                char alter_query[512];
                snprintf(alter_query, sizeof(alter_query), "ALTER TABLE %s ADD COLUMN %s", table_name, column);
                mysql_query(conn, alter_query);
            }

            strcat(columns_to_keep, column_name);
            strcat(columns_to_keep, ",");
            token = strtok(NULL, ",");
        }

        // Drop extra columns
        char *existing_col = strtok(existing_columns, ",");
        while (existing_col != NULL) {
            if (!strstr(columns_to_keep, existing_col)) {
                char drop_query[512];
                snprintf(drop_query, sizeof(drop_query), "ALTER TABLE %s DROP COLUMN %s", table_name, existing_col);
                mysql_query(conn, drop_query);
            }
            existing_col = strtok(NULL, ",");
        }
    }

    napi_value result_value;
    napi_get_boolean(env, 1, &result_value);
    return result_value;
}

/** Function to Select Data from MySQL */
napi_value Select(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1], result;
    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    if (argc < 1) {
        napi_throw_error(env, NULL, "Expected 1 argument: query");
        return NULL;
    }

    char query[2048];
    napi_get_value_string_utf8(env, args[0], query, sizeof(query), NULL);

    MYSQL_RES *res;
    if (mysql_query(conn, query) == 0) {
        res = mysql_store_result(conn);
        int num_fields = mysql_num_fields(res);
        MYSQL_ROW row;
        napi_value array;
        napi_create_array(env, &array);
        int index = 0;

        while ((row = mysql_fetch_row(res))) {
            napi_value obj;
            napi_create_object(env, &obj);
            for (int i = 0; i < num_fields; i++) {
                napi_value value;
                napi_create_string_utf8(env, row[i] ? row[i] : "NULL", NAPI_AUTO_LENGTH, &value);
                MYSQL_FIELD *field = mysql_fetch_field_direct(res, i);
                napi_set_named_property(env, obj, field->name, value);
            }
            napi_set_element(env, array, index++, obj);
        }
        mysql_free_result(res);
        return array;
    }

    napi_throw_error(env, NULL, mysql_error(conn));
    napi_get_undefined(env, &result);
    return result;
}
