#ifndef MYSQL_POOL_H
#define MYSQL_POOL_H

#include <mysql.h>
#include <pthread.h>
#include <stdbool.h>

/**
 * ## Define the maximum number of connections in the pool
 * @note This is the maximum number of connections that can be created in the pool
 */
#define MAX_POOL_SIZE 10

/**
 * ## Define the minimum number of connections in the pool
 * @note This is the minimum number of connections that will be created in the pool
 */
#define MIN_POOL_SIZE 2

/**
 * Pool connection
 */
typedef struct {
    MYSQL *connection;
    bool in_use;
} PoolConnection;

/**
 * Connection pool Manager
 * - It manages the connection pool
 * - It provides a direct connection to the database
 * - It provides a connection from the pool
 * @note This is the manager of the connection pool
 */
typedef struct {
    PoolConnection connections[MAX_POOL_SIZE];
    int current_size;
    pthread_mutex_t lock;
    char *host;
    char *user;
    char *password;
    char *database;
    int port;
} ConnectionPool;

/**
 * ## Create a connection pool
 * @param host - Host name
 * @param user - User name
 * @param password - Password
 * @param database - Database name
 * @param port - Port number
 * @return ConnectionPool* - Connection pool
 */
ConnectionPool *pool_create(const char *host, const char *user, const char *password, const char *database, int port);

/**
 * Destroy a connection pool
 * @param pool - Connection pool
 */
void pool_destroy(ConnectionPool *pool);

/**
 * Get a connection from the pool
 * @param pool - Connection pool
 * @return MYSQL* - Connection
 */
MYSQL *pool_get_connection(ConnectionPool *pool);

/**
 * Return a connection to the pool
 * @param pool - Connection pool
 * @param conn - Connection
 */
void pool_return_connection(ConnectionPool *pool, MYSQL *conn);

/**
 * Validate a connection
 * @param conn - Connection
 * @return bool - True if the connection is valid, false otherwise
 */
bool pool_validate_connection(MYSQL *conn);

#endif