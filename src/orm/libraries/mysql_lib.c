#include "../include/mysql_helper.h"
#include "../include/mysql_pool.h"
#include <ctype.h>
#include <mysql.h>
#include <node_api.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static ConnectionPool *pool = NULL; // Pool Manager
static MYSQL *conn = NULL;          // Direct Connection

/** Initialize the connection pool */
napi_value Initialize(napi_env env, napi_callback_info info) {
    size_t argc = 5;
    napi_value args[5];
    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    if (argc < 5) {
        napi_throw_error(env, NULL, "Wrong number of arguments");
        return NULL;
    }

    char host[256], user[256], password[256], database[256];
    int port;

    napi_get_value_string_utf8(env, args[0], host, sizeof(host), NULL);
    napi_get_value_string_utf8(env, args[1], user, sizeof(user), NULL);
    napi_get_value_string_utf8(env, args[2], password, sizeof(password), NULL);
    napi_get_value_string_utf8(env, args[3], database, sizeof(database), NULL);
    napi_get_value_int32(env, args[4], &port);

    //? Step 1 : Setup Direct Conection
    if (conn != NULL) {
        mysql_close(conn);
    }

    conn = mysql_init(NULL);
    if (!mysql_real_connect(conn, host, user, password, database, port, NULL, 0)) {
        napi_throw_error(env, NULL, mysql_error(conn));
        return NULL;
    }

    //? Step 2 : Setup Connection Pool
    if (pool != NULL) {
        pool_destroy(pool);
    }

    pool = pool_create(host, user, password, database, port);
    if (!pool) {
        napi_throw_error(env, NULL, "Failed to create connection pool");
        return NULL;
    }

    napi_value result;
    napi_get_boolean(env, true, &result);
    return result;
}

/** Add cleanup function */
napi_value Cleanup(napi_env env, napi_callback_info info) {
    if (pool) {
        pool_destroy(pool);
        pool = NULL;
    }

    napi_value result;
    napi_get_boolean(env, true, &result);
    return result;
}

/** Function to Connect to MySQL with Parameters @deprecated Use `initialize` instead */
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

/** Function to Create Index */
napi_value CreateIndex(napi_env env, napi_callback_info info) {
    size_t argc = 3;
    napi_value args[3];
    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    if (argc < 3) {
        napi_throw_error(env, NULL, "Expected 3 arguments: table_name, index_name, columns");
        return NULL;
    }

    char table_name[256];
    char index_name[256];
    char columns[1024];
    napi_get_value_string_utf8(env, args[0], table_name, sizeof(table_name), NULL);
    napi_get_value_string_utf8(env, args[1], index_name, sizeof(index_name), NULL);
    napi_get_value_string_utf8(env, args[2], columns, sizeof(columns), NULL);

    char query[2048];
    snprintf(query, sizeof(query), "SHOW INDEX FROM %s WHERE Key_name = '%s'", table_name, index_name);

    if (mysql_query(conn, query)) {
        char error_message[256];
        snprintf(error_message, sizeof(error_message), "Failed to execute SHOW INDEX query: %s", mysql_error(conn));
        napi_throw_error(env, NULL, error_message);
        return NULL;
    }

    MYSQL_RES *result = mysql_store_result(conn);
    if (!result) {
        napi_throw_error(env, NULL, "Failed to retrieve result from SHOW INDEX query");
        return NULL;
    }

    int index_exists = mysql_num_rows(result) > 0;
    mysql_free_result(result);

    if (!index_exists) {
        snprintf(query, sizeof(query), "CREATE INDEX %s ON %s (%s)", index_name, table_name, columns);
        if (mysql_query(conn, query)) {
            char error_message[256];
            snprintf(error_message, sizeof(error_message), "Failed to create index: %s", mysql_error(conn));
            napi_throw_error(env, NULL, error_message);
            return NULL;
        }
    } else {
        printf("[CREATE INDEX] Index %s already exists on table %s\n", index_name, table_name);
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

    if (!conn) {
        napi_throw_error(env, NULL, "Database not initialized");
        return NULL;
    }

    MYSQL *connection = pool_get_connection(pool);
    if (!connection) {
        napi_throw_error(env, NULL, "Failed to get database connection");
        return NULL;
    }

    MYSQL_STMT *stmt = mysql_stmt_init(connection);
    if (!stmt) {
        pool_return_connection(pool, connection);
        napi_throw_error(env, NULL, "Statement initialization failed");
        return NULL;
    }

    if (mysql_stmt_prepare(stmt, query, strlen(query)) || mysql_stmt_execute(stmt)) {
        napi_throw_error(env, NULL, mysql_stmt_error(stmt));
        mysql_stmt_close(stmt);
        pool_return_connection(pool, connection);
        return NULL;
    }

    MYSQL_RES *metadata = mysql_stmt_result_metadata(stmt);
    if (!metadata) {
        napi_throw_error(env, NULL, "Failed to retrieve metadata");
        mysql_stmt_close(stmt);
        pool_return_connection(pool, connection);
        return NULL;
    }

    unsigned int num_fields = mysql_num_fields(metadata);
    MYSQL_FIELD *fields = mysql_fetch_fields(metadata);
    MYSQL_BIND *bind = (MYSQL_BIND *)calloc(num_fields, sizeof(MYSQL_BIND));

    char row_data[num_fields][8192];
    unsigned long lengths[num_fields];
    bool is_nulls[num_fields];

    for (unsigned int i = 0; i < num_fields; i++) {
        bind[i].buffer_type = MYSQL_TYPE_STRING;
        bind[i].buffer = row_data[i];
        bind[i].buffer_length = sizeof(row_data[i]);
        bind[i].length = &lengths[i];
        bind[i].is_null = &is_nulls[i];
    }

    // Initialize result to an undefined value
    napi_get_undefined(env, &result);

    if (mysql_stmt_bind_result(stmt, bind)) {
        napi_throw_error(env, NULL, "Failed to bind result");
        goto cleanup;
    }

    napi_create_array(env, &result);
    uint32_t row_index = 0;

    while (!mysql_stmt_fetch(stmt)) {
        napi_value row_obj;
        napi_create_object(env, &row_obj);

        for (unsigned int i = 0; i < num_fields; i++) {
            napi_value field_value;
            napi_create_string_utf8(env, is_nulls[i] ? "" : row_data[i], lengths[i], &field_value);
            napi_set_named_property(env, row_obj, fields[i].name, field_value);
        }

        napi_set_element(env, result, row_index++, row_obj);
    }

cleanup:
    mysql_free_result(metadata);
    mysql_stmt_close(stmt);
    pool_return_connection(pool, connection);
    free(bind);

    return result;
}

/** Function to Insert Data into MySQL */
napi_value Insert(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1], result;
    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    if (argc < 1) {
        napi_throw_error(env, NULL, "Expected 1 argument: query");
        return NULL;
    }

    char query[2048];
    napi_get_value_string_utf8(env, args[0], query, sizeof(query), NULL);

    if (!pool) {
        napi_throw_error(env, NULL, "Database not initialized");
        return NULL;
    }

    //? Step 1: Get a connection from the pool
    MYSQL *conn = pool_get_connection(pool);
    if (!conn) {
        napi_throw_error(env, NULL, "Could not get database connection from pool");
        return NULL;
    }

    //? Step 2: Use connection to execute query
    if (mysql_query(conn, query) == 0) {
        // Get the number of affected rows
        my_ulonglong affected_rows = mysql_affected_rows(conn);
        // Get the last insert ID
        my_ulonglong last_id = mysql_insert_id(conn);

        // Create return object with affected rows and insert ID
        napi_value obj;
        napi_create_object(env, &obj);

        napi_value affected_rows_value;
        napi_create_int64(env, (int64_t)affected_rows, &affected_rows_value);
        napi_set_named_property(env, obj, "affectedRows", affected_rows_value);

        napi_value insert_id_value;
        napi_create_int64(env, (int64_t)last_id, &insert_id_value);
        napi_set_named_property(env, obj, "insertId", insert_id_value);

        //? Step 3: Return connection to the pool
        pool_return_connection(pool, conn);

        return obj;
    }

    napi_throw_error(env, NULL, mysql_error(conn));
    napi_get_undefined(env, &result);

    //? Step 3: Return connection to the pool
    pool_return_connection(pool, conn);

    return result;
}

/** Function to Update Data in MySQL */
napi_value Update(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1], result;
    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    if (argc < 1) {
        napi_throw_error(env, NULL, "Expected 1 argument: query");
        return NULL;
    }

    char query[2048];
    napi_get_value_string_utf8(env, args[0], query, sizeof(query), NULL);

    if (!pool) {
        napi_throw_error(env, NULL, "Database not initialized");
        return NULL;
    }

    //? Step 1: Get a connection from the pool
    MYSQL *conn = pool_get_connection(pool);
    if (!conn) {
        napi_throw_error(env, NULL, "Could not get database connection from pool");
        return NULL;
    }

    //? Step 2: Use connection to execute query
    if (mysql_query(conn, query) == 0) {
        my_ulonglong affected_rows = mysql_affected_rows(conn);

        napi_value obj;
        napi_create_object(env, &obj);

        napi_value affected_rows_value;
        napi_create_int64(env, (int64_t)affected_rows, &affected_rows_value);
        napi_set_named_property(env, obj, "affectedRows", affected_rows_value);

        //? Step 3: Return connection to the pool
        pool_return_connection(pool, conn);

        return obj;
    }

    napi_throw_error(env, NULL, mysql_error(conn));
    napi_get_undefined(env, &result);

    //? Step 3: Return connection to the pool
    pool_return_connection(pool, conn);

    return result;
}

/** Function to Delete Data from MySQL */
napi_value Delete(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1], result;
    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    if (argc < 1) {
        napi_throw_error(env, NULL, "Expected 1 argument: query");
        return NULL;
    }

    char query[2048];
    napi_get_value_string_utf8(env, args[0], query, sizeof(query), NULL);

    if (!pool) {
        napi_throw_error(env, NULL, "Database not initialized");
        return NULL;
    }

    //? Step 1: Get a connection from the pool
    MYSQL *conn = pool_get_connection(pool);
    if (!conn) {
        napi_throw_error(env, NULL, "Could not get database connection from pool");
        return NULL;
    }

    //? Step 2: Use connection to execute query
    if (mysql_query(conn, query) == 0) {
        my_ulonglong affected_rows = mysql_affected_rows(conn);

        napi_value obj;
        napi_create_object(env, &obj);

        napi_value affected_rows_value;
        napi_create_int64(env, (int64_t)affected_rows, &affected_rows_value);
        napi_set_named_property(env, obj, "affectedRows", affected_rows_value);

        //? Step 3: Return connection to the pool
        pool_return_connection(pool, conn);

        return obj;
    }

    napi_throw_error(env, NULL, mysql_error(conn));
    napi_get_undefined(env, &result);

    //? Step 3: Return connection to the pool
    pool_return_connection(pool, conn);

    return result;
}

/** Function to Bulk Insert Data into MySQL */
napi_value BulkInsert(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1], result;
    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    if (argc < 1) {
        napi_throw_error(env, NULL, "Expected 1 argument: query");
        return NULL;
    }

    char query[16384];
    napi_get_value_string_utf8(env, args[0], query, sizeof(query), NULL);

    if (!pool) {
        napi_throw_error(env, NULL, "Database not initialized");
        return NULL;
    }

    MYSQL *conn = pool_get_connection(pool);
    if (!conn) {
        napi_throw_error(env, NULL, "Could not get database connection from pool");
        return NULL;
    }

    if (mysql_query(conn, query) == 0) {
        my_ulonglong affected_rows = mysql_affected_rows(conn);
        my_ulonglong last_id = mysql_insert_id(conn);

        napi_value obj;
        napi_create_object(env, &obj);

        napi_value affected_rows_value;
        napi_create_int64(env, (int64_t)affected_rows, &affected_rows_value);
        napi_set_named_property(env, obj, "affectedRows", affected_rows_value);

        napi_value insert_id_value;
        napi_create_int64(env, (int64_t)last_id, &insert_id_value);
        napi_set_named_property(env, obj, "insertId", insert_id_value);

        pool_return_connection(pool, conn);
        return obj;
    }

    const char *error_msg = mysql_error(conn);
    pool_return_connection(pool, conn);
    napi_throw_error(env, NULL, error_msg);
    return NULL;
}

// =========================== TRIGGERS ===========================

/** Function to Create Trigger
 * @example
 * createTrigger(
 *    'before_user_insert_timestamp',
 *    'users',
 *    'BEFORE',
 *    'SET NEW.createdAt = NOW()'
 * );
 */
napi_value CreateTrigger(napi_env env, napi_callback_info info) {
    size_t argc = 4;
    napi_value args[4];
    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    if (argc < 4) {
        napi_throw_error(env, NULL, "Expected 4 arguments: triggerName, tableName, triggerTime, triggerBody");
        return NULL;
    }

    char trigger_name[256];
    char table_name[256];
    char trigger_time[16];
    char trigger_body[4096];

    napi_get_value_string_utf8(env, args[0], trigger_name, sizeof(trigger_name), NULL);
    napi_get_value_string_utf8(env, args[1], table_name, sizeof(table_name), NULL);
    napi_get_value_string_utf8(env, args[2], trigger_time, sizeof(trigger_time), NULL);
    napi_get_value_string_utf8(env, args[3], trigger_body, sizeof(trigger_body), NULL);

    if (!pool) {
        napi_throw_error(env, NULL, "Database not initialized");
        return NULL;
    }

    // Get connection from pool
    MYSQL *conn = pool_get_connection(pool);
    if (!conn) {
        napi_throw_error(env, NULL, "Could not get database connection from pool");
        return NULL;
    }

    // Drop existing trigger if it exists
    char drop_query[512];
    snprintf(drop_query, sizeof(drop_query), "DROP TRIGGER IF EXISTS %s", trigger_name);

    if (mysql_query(conn, drop_query)) {
        const char *error_msg = mysql_error(conn);
        pool_return_connection(pool, conn);
        napi_throw_error(env, NULL, error_msg);
        return NULL;
    }

    // Create new trigger
    char create_query[8192];
    snprintf(create_query, sizeof(create_query),
             "CREATE TRIGGER %s " // trigger name
             "%s INSERT ON %s "   // BEFORE/AFTER + table name
             "FOR EACH ROW "
             "%s", // trigger body
             trigger_name, trigger_time, table_name, trigger_body);

    if (mysql_query(conn, create_query)) {
        const char *error_msg = mysql_error(conn);
        pool_return_connection(pool, conn);
        napi_throw_error(env, NULL, error_msg);
        return NULL;
    }

    pool_return_connection(pool, conn);

    napi_value result;
    napi_get_boolean(env, true, &result);
    return result;
}
