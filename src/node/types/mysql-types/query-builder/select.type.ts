import { InsertOptions, WhereCondition } from './condition.type'

/**
 * Interface for building SQL SELECT queries in a fluent, chainable manner.
 * @template T - The type of entity being queried
 */
export interface SelectQueryBuilder<T = any> {
  /**
   * Specifies the columns to select in the query
   * @param columns - Single column name or array of column names
   * @example
   * // Select all columns
   * .select('*')
   * // Select specific columns
   * .select(['id', 'name', 'email'])
   */
  select(columns: '*' | keyof T | Array<keyof T>): SelectQueryBuilder<T>

  /**
   * Specifies the native query to execute
   * @param query - The native query string
   * @example
   * .native('SELECT * FROM users')
   */
  native(query: string): SelectQueryBuilder<T>

  /**
   * Specifies the table to select from
   * @param table - Name of the table
   * @example
   * .from('users')
   */
  from(table: string): SelectQueryBuilder<T>

  /**
   * Adds a WHERE clause to the query
   * @param condition - SQL condition string or object of key-value pairs
   * @example
   * // Using object syntax
   * .where({ id: 1, status: 'active' })
   * // Using string condition
   * .where('age > 18')
   */
  where(condition: WhereCondition<T>): SelectQueryBuilder<T>

  /**
   * Adds an AND WHERE clause to the query
   * @param condition - SQL condition string or object of key-value pairs
   * @example
   * .where({ id: 1 })
   * .andWhere({ status: 'active' })
   */
  andWhere(condition: WhereCondition<T>): SelectQueryBuilder<T>

  /**
   * Adds an OR WHERE clause to the query
   * @param condition - SQL condition string or object of key-value pairs
   * @example
   * .where({ status: 'active' })
   * .orWhere({ status: 'pending' })
   */
  orWhere(condition: WhereCondition<T>): SelectQueryBuilder<T>

  /**
   * Adds a JOIN clause to the query
   * @param table - Table to join with
   * @param condition - Join condition (ON clause)
   * @example
   * .join('orders', 'users.id = orders.user_id')
   */
  join(table: string, condition: string): SelectQueryBuilder<T>

  /**
   * Adds a LEFT JOIN clause to the query
   * @param table - Table to join with
   * @param condition - Join condition (ON clause)
   * @example
   * .leftJoin('orders', 'users.id = orders.user_id')
   */
  leftJoin(table: string, condition: string): SelectQueryBuilder<T>

  /**
   * Adds a RIGHT JOIN clause to the query
   * @param table - Table to join with
   * @param condition - Join condition (ON clause)
   * @example
   * .rightJoin('orders', 'users.id = orders.user_id')
   */
  rightJoin(table: string, condition: string): SelectQueryBuilder<T>

  /**
   * Adds an INNER JOIN clause to the query
   * @param table - Table to join with
   * @param condition - Join condition (ON clause)
   * @example
   * .innerJoin('orders', 'users.id = orders.user_id')
   */
  innerJoin(table: string, condition: string): SelectQueryBuilder<T>

  /**
   * Adds a GROUP BY clause to the query
   * @param columns - Column(s) to group by
   * @example
   * // Single column
   * .groupBy('status')
   * // Multiple columns
   * .groupBy(['status', 'country'])
   */
  groupBy(columns: string | string[]): SelectQueryBuilder<T>

  /**
   * Adds a HAVING clause to the query
   * @param condition - Having condition string or object
   * @example
   * .groupBy('country')
   * .having('COUNT(*) > 5')
   */
  having(condition: string | object): SelectQueryBuilder<T>

  /**
   * Adds an ORDER BY clause to the query
   * @param column - Column to order by
   * @param direction - Sort direction ('ASC' or 'DESC')
   * @example
   * .orderBy('created_at', 'DESC')
   */
  orderBy(column: string, direction?: 'ASC' | 'DESC'): SelectQueryBuilder<T>

  /**
   * Sets the LIMIT clause of the query
   * @param limit - Maximum number of rows to return
   * @example
   * .limit(10)
   */
  limit(limit: number): SelectQueryBuilder<T>

  /**
   * Sets the OFFSET clause of the query
   * @param offset - Number of rows to skip
   * @example
   * .offset(20)
   */
  offset(offset: number): SelectQueryBuilder<T>

  /**
   * Returns the generated SQL query string
   * @returns The complete SQL query string
   * @example
   * const query = queryBuilder
   *   .select(['id', 'name'])
   *   .from('users')
   *   .where({ status: 'active' })
   *   .getQuery()
   */
  getQuery(): string

  /**
   * Adds an INSERT INTO clause to the query
   * @param options - Insert options
   * @example
   * .insert({ columns: ['name', 'email'], values: [{ name: 'John', email: 'john@example.com' }] })
   */
  insert(options: InsertOptions<T>): SelectQueryBuilder<T>
}
