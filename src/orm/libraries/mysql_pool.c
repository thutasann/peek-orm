#include "../include/mysql_pool.h"
#include <mysql.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/**
 * ## Create a connection
 * @param pool - Connection pool
 * @return MYSQL* - Connection
 */
static MYSQL *create_connection(ConnectionPool *pool) {
    MYSQL *conn = mysql_init(NULL);
    if (conn == NULL) {
        return NULL;
    }

    unsigned int timeout = 60;
    mysql_options(conn, MYSQL_OPT_CONNECT_TIMEOUT, &timeout);
    mysql_options(conn, MYSQL_OPT_READ_TIMEOUT, &timeout);
    mysql_options(conn, MYSQL_OPT_WRITE_TIMEOUT, &timeout);

    if (!mysql_real_connect(conn, pool->host, pool->user, pool->password,
                            pool->database, pool->port, NULL, 0)) {
        mysql_close(conn);
        return NULL;
    }

    return conn;
}

ConnectionPool *pool_create(const char *host, const char *user, const char *password, const char *database, int port) {
    ConnectionPool *pool = (ConnectionPool *)malloc(sizeof(ConnectionPool));
    if (!pool) {
        return NULL;
    }

    pool->current_size = 0;
    pthread_mutex_init(&pool->lock, NULL);

    pool->host = strdup(host);
    pool->user = strdup(user);
    pool->password = strdup(password);
    pool->database = strdup(database);
    pool->port = port;

    for (int i = 0; i < MAX_POOL_SIZE; i++) {
        pool->connections[i].connection = NULL;
        pool->connections[i].in_use = false;
    }

    for (int i = 0; i < MIN_POOL_SIZE; i++) {
        pool->connections[i].connection = create_connection(pool);
        if (pool->connections[i].connection == NULL) {
            pool_destroy(pool);
            return NULL;
        }
    }

    return pool;
}

void pool_destroy(ConnectionPool *pool) {
    if (!pool)
        return;

    pthread_mutex_lock(&pool->lock);

    for (int i = 0; i < MAX_POOL_SIZE; i++) {
        if (pool->connections[i].connection) {
            mysql_close(pool->connections[i].connection);
        }
    }

    free(pool->host);
    free(pool->user);
    free(pool->password);
    free(pool->database);

    pthread_mutex_unlock(&pool->lock);
    pthread_mutex_destroy(&pool->lock);
    free(pool);
}

bool pool_validate_connection(MYSQL *conn) {
    if (!conn) {
        return false;
    }
    return mysql_ping(conn) == 0;
}

MYSQL *pool_get_connection(ConnectionPool *pool) {
    if (!pool) {
        return NULL;
    }

    pthread_mutex_lock(&pool->lock);

    // First, try to find an existig free connection
    for (int i = 0; i < pool->current_size; i++) {
        if (!pool->connections[i].in_use) {
            if (pool_validate_connection(pool->connections[i].connection)) {
                pool->connections[i].in_use = true;
                pthread_mutex_unlock(&pool->lock);
                return pool->connections[i].connection;
            } else {
                mysql_close(pool->connections[i].connection);
                pool->connections[i].connection = create_connection(pool);
                if (pool->connections[i].connection) {
                    pool->connections[i].in_use = true;
                    pthread_mutex_unlock(&pool->lock);
                    return pool->connections[i].connection;
                }
            }
        }
    }

    // If no free connection and pool not full, create new one
    if (pool->current_size < MAX_POOL_SIZE) {
        MYSQL *conn = create_connection(pool);
        if (conn) {
            pool->connections[pool->current_size].connection = conn;
            pool->connections[pool->current_size].in_use = true;
            pool->current_size++;
            pthread_mutex_unlock(&pool->lock);
            return conn;
        }
    }

    pthread_mutex_unlock(&pool->lock);
    return NULL;
}

void pool_return_connection(ConnectionPool *pool, MYSQL *conn) {
    if (!pool || !conn) {
        return;
    }

    pthread_mutex_lock(&pool->lock);

    // Find the connection in the pool and mark it as not in use
    for (int i = 0; i < pool->current_size; i++) {
        if (pool->connections[i].connection == conn) {
            pool->connections[i].in_use = false;
            break;
        }
    }

    pthread_mutex_unlock(&pool->lock);
}