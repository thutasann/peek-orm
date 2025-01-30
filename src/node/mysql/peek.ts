import { insert as insertQuery, select as selectQuery } from '../../build/Release/peek-orm.node'
import { InsertOptions, SelectQueryBuilder } from '../types'
import { createQueryBuilder } from './query-builder'

/**
 * ## Peek ORM
 * @description
 * Peek ORM is a fast, simple and easy to use ORM for MySQL built on top of the MySQL C API
 * @author [thutasann](https://github.com/thutasann)
 */
export class peek {
  /**
   * Execute a SELECT query on a table
   * @param table - Name of the table to query
   * @param callback - Function to build the query
   * @returns {Promise<T[]>} Array of query results
   */
  static async select<T extends Record<string, any>>(
    table: string,
    callback: (queryBuilder: SelectQueryBuilder<T>) => SelectQueryBuilder<T>,
  ): Promise<T[]> {
    const queryBuilder = createQueryBuilder<T>()
    queryBuilder.from(table)
    const query = callback(queryBuilder)
    const finalQuery = query.getQuery()
    return selectQuery(finalQuery) as unknown as T[]
  }

  /**
   * Execute a SELECT query on a table
   * @param table - Name of the table to query
   * @param callback - Function to build the query
   * @returns {Promise<T>} Query result
   */
  static async selectOne<T extends Record<string, any>>(
    table: string,
    callback: (queryBuilder: SelectQueryBuilder<T>) => SelectQueryBuilder<T>,
  ): Promise<T> {
    const queryBuilder = createQueryBuilder<T>()
    queryBuilder.from(table)
    const query = callback(queryBuilder)
    const finalQuery = query.getQuery()
    const result = await selectQuery(finalQuery)
    return result[0] as unknown as T
  }

  /**
   * Execute an INSERT query on a table
   * @param table - Name of the table to insert into
   * @param values - Values to insert
   * @returns {Promise<void>} - Promise that resolves when the insert is complete
   */
  static async insert<T extends Record<string, any>>(table: string, values: InsertOptions<T>): Promise<void> {
    const queryBuilder = createQueryBuilder<T>()
    queryBuilder.from(table)
    queryBuilder.insert(values)
    const finalQuery = queryBuilder.getQuery()
    return insertQuery(finalQuery)
  }
}
