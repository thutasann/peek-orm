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

    // Initialize mutex first for proper cleanup in case of failure
    if (pthread_mutex_init(&pool->lock, NULL) != 0) {
        free(pool);
        return NULL;
    }

    // Copy strings with error checking
    if (!(pool->host = strdup(host)) ||
        !(pool->user = strdup(user)) ||
        !(pool->password = strdup(password)) ||
        !(pool->database = strdup(database))) {
        pool_destroy(pool);
        return NULL;
    }

    pool->port = port;
    pool->current_size = 0;

    // Initialize all connections to NULL
    memset(pool->connections, 0, sizeof(pool->connections));
    for (int i = 0; i < MAX_POOL_SIZE; i++) {
        pool->connections[i].in_use = false;
    }

    // Create initial connections
    for (int i = 0; i < MIN_POOL_SIZE; i++) {
        MYSQL *conn = create_connection(pool);
        if (!conn) {
            pool_destroy(pool);
            return NULL;
        }
        pool->connections[i].connection = conn;
        pool->current_size++;
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

    // First, try to reuse existing connections
    for (int i = 0; i < pool->current_size; i++) {
        if (!pool->connections[i].in_use) {
            MYSQL *conn = pool->connections[i].connection;

            // Validate and potentially reconnect
            if (!pool_validate_connection(conn)) {
                mysql_close(conn);
                conn = create_connection(pool);
                if (!conn) {
                    continue; // Try next connection if reconnection fails
                }
                pool->connections[i].connection = conn;
            }

            pool->connections[i].in_use = true;
            pthread_mutex_unlock(&pool->lock);
            return conn;
        }
    }

    // If we need to expand the pool
    if (pool->current_size < MAX_POOL_SIZE) {
        MYSQL *conn = create_connection(pool);
        if (conn) {
            int idx = pool->current_size++;
            pool->connections[idx].connection = conn;
            pool->connections[idx].in_use = true;
            pthread_mutex_unlock(&pool->lock);
            return conn;
        }
    }

    // Pool is full and all connections are in use
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