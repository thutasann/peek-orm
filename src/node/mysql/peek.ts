import {
  bulkInsert as bulkInsertQuery,
  deleteQuery,
  insert as insertQuery,
  select as selectQuery,
  update as updateQuery,
} from '../../build/Release/peek-orm.node'
import { InsertedResult, QueryBuilder } from '../types'
import { createQueryBuilder } from './query-builder'

/**
 * ## Peek ORM
 * @description Peek ORM is a high-performance Node.js ORM (Object-Relational Mapping) package that leverages native C bindings for optimal speed and efficiency. It provides a seamless bridge between your Node.js application and relational databases, offering native-level performance while maintaining the ease of use of JavaScript.Peek ORM is a fast, simple and easy to use ORM for MySQL built on top of the MySQL C API
 * @version 0.0.1
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
    callback: (queryBuilder: QueryBuilder<T>) => QueryBuilder<T>,
  ): Promise<T[]> {
    const queryBuilder = createQueryBuilder<T>().from(table)
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
    callback: (queryBuilder: QueryBuilder<T>) => QueryBuilder<T>,
  ): Promise<T> {
    const queryBuilder = createQueryBuilder<T>().from(table)
    const query = callback(queryBuilder)
    const finalQuery = query.getQuery()
    const result = await selectQuery(finalQuery)
    return result[0] as unknown as T
  }

  /**
   * Execute an INSERT query on a table
   * @overload
   * @param table - Name of the table to insert into
   * @param values - Single record to insert
   * @returns Promise with insert result and input values
   */
  static async insert<T extends Record<string, any>>(
    table: string,
    values: Partial<T>,
  ): Promise<{ result: InsertedResult; values: Partial<T> }>

  /**
   * Execute an INSERT query on a table
   * @overload
   * @param table - Name of the table to insert into
   * @param values - Array of records to insert
   * @returns Promise with insert result and input values Array
   */
  static async insert<T extends Record<string, any>>(
    table: string,
    values: Partial<T>[],
  ): Promise<{ result: InsertedResult; values: Partial<T>[] }>

  static async insert<T extends Record<string, any>>(
    table: string,
    values: Partial<T> | Partial<T>[],
  ): Promise<{
    result: InsertedResult
    values: Partial<T> | Partial<T>[]
  }> {
    const queryBuilder = createQueryBuilder<T>().from(table).insert(table, values)
    const result = await insertQuery(queryBuilder.getQuery())
    return { result, values }
  }

  /**
   * Execute an UPDATE one query on a table
   * @param table - Name of the table to update
   * @param values - Single record to update
   * @returns Promise with update result and input values
   */
  static async updateOne<T extends Record<string, any>>(
    table: string,
    where: Partial<T>,
    values: Partial<T>,
  ): Promise<{ result: InsertedResult; values: Partial<T> }> {
    const queryBuilder = createQueryBuilder<T>().from(table).updateOne(table, where, values)
    const result = await updateQuery(queryBuilder.getQuery())
    return { result, values }
  }

  /**
   * Execute an UPDATE many query on a table
   * @param table - Name of the table to update
   * @param where - Where clause
   * @param values - Array of records to update
   * @returns Promise with update result and input values Array
   */
  static async updateMany<T extends Record<string, any>>(
    table: string,
    where: Partial<T>,
    values: Partial<T>[],
  ): Promise<{ result: InsertedResult; values: Partial<T>[] }> {
    const queryBuilder = createQueryBuilder<T>().from(table).updateMany(table, where, values)
    const result = await updateQuery(queryBuilder.getQuery())
    return { result, values }
  }

  /**
   * Execute a DELETE query on a table
   * @param table - Name of the table to delete from
   * @param where - Where clause
   * @returns Promise with delete result
   */
  static async delete<T extends Record<string, any>>(
    table: string,
    where: Partial<T>,
  ): Promise<{ result: InsertedResult }> {
    const queryBuilder = createQueryBuilder<T>().from(table).delete(table, where)
    const result = await deleteQuery(queryBuilder.getQuery())
    return { result }
  }

  /**
   * Execute a BULK INSERT query on a table
   * @param table - Name of the table to insert into
   * @param values - Array of records to insert
   * @returns Promise with insert result and input values Array
   */
  static async bulkInsert<T extends Record<string, any>>(
    table: string,
    values: Partial<T>[],
  ): Promise<{ result: InsertedResult; values: Partial<T>[] }> {
    const queryBuilder = createQueryBuilder<T>().from(table).bulkInsert(table, values)
    const result = await bulkInsertQuery(queryBuilder.getQuery())
    return { result, values }
  }
}
