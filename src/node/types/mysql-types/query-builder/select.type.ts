/**
 * Interface for building SQL SELECT queries in a fluent, chainable manner.
 * @template T - The type of entity being queried
 */
export interface SelectQueryBuilder<T = any> {
  /**
   * Specifies the columns to select in the query
   * @param columns - Single column name or array of column names
   */
  select(columns: string | string[]): SelectQueryBuilder<T>

  /**
   * Specifies the table to select from
   * @param table - Name of the table
   */
  from(table: string): SelectQueryBuilder<T>

  /**
   * Adds a WHERE clause to the query
   * @param condition - SQL condition string or object of key-value pairs
   */
  where(condition: string | object): SelectQueryBuilder<T>

  /**
   * Adds an AND WHERE clause to the query
   * @param condition - SQL condition string or object of key-value pairs
   */
  andWhere(condition: string | object): SelectQueryBuilder<T>

  /**
   * Adds an OR WHERE clause to the query
   * @param condition - SQL condition string or object of key-value pairs
   */
  orWhere(condition: string | object): SelectQueryBuilder<T>

  /**
   * Adds a JOIN clause to the query
   * @param table - Table to join with
   * @param condition - Join condition (ON clause)
   */
  join(table: string, condition: string): SelectQueryBuilder<T>

  /**
   * Adds a LEFT JOIN clause to the query
   * @param table - Table to join with
   * @param condition - Join condition (ON clause)
   */
  leftJoin(table: string, condition: string): SelectQueryBuilder<T>

  /**
   * Adds a RIGHT JOIN clause to the query
   * @param table - Table to join with
   * @param condition - Join condition (ON clause)
   */
  rightJoin(table: string, condition: string): SelectQueryBuilder<T>

  /**
   * Adds an INNER JOIN clause to the query
   * @param table - Table to join with
   * @param condition - Join condition (ON clause)
   */
  innerJoin(table: string, condition: string): SelectQueryBuilder<T>

  /**
   * Adds a GROUP BY clause to the query
   * @param columns - Column(s) to group by
   */
  groupBy(columns: string | string[]): SelectQueryBuilder<T>

  /**
   * Adds a HAVING clause to the query
   * @param condition - Having condition string or object
   */
  having(condition: string | object): SelectQueryBuilder<T>

  /**
   * Adds an ORDER BY clause to the query
   * @param column - Column to order by
   * @param direction - Sort direction ('ASC' or 'DESC')
   */
  orderBy(column: string, direction?: 'ASC' | 'DESC'): SelectQueryBuilder<T>

  /**
   * Sets the LIMIT clause of the query
   * @param limit - Maximum number of rows to return
   */
  limit(limit: number): SelectQueryBuilder<T>

  /**
   * Sets the OFFSET clause of the query
   * @param offset - Number of rows to skip
   */
  offset(offset: number): SelectQueryBuilder<T>

  /**
   * Returns the generated SQL query string
   * @returns The complete SQL query string
   */
  getQuery(): string

  /**
   * Executes the query and returns all matching results
   * @returns Promise resolving to an array of results
   */
  execute(): Promise<T[]>

  /**
   * Executes the query and returns the first result
   * @returns Promise resolving to a single result or null if none found
   */
  getOne(): Promise<T | null>

  /**
   * Executes a COUNT query and returns the number of matching rows
   * @returns Promise resolving to the count of matching rows
   */
  getCount(): Promise<number>
}

/**
 * Type definition for WHERE clause conditions
 * Accepts either an object of key-value pairs or a raw SQL string
 */
export type WhereCondition =
  | {
      [key: string]: any
    }
  | string

/**
 * Type definition for ORDER BY direction
 * Specifies the sort order in ORDER BY clauses
 */
export type OrderDirection = 'ASC' | 'DESC'

/**
 * Type definition for JOIN types
 * Specifies the type of JOIN operation
 */
export type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL OUTER'

/**
 * Interface for configuring SELECT query options
 * Provides a structured way to define query parameters
 */
export interface SelectOptions {
  /** Whether to use SELECT DISTINCT */
  distinct?: boolean

  /** Array of columns to select */
  columns?: string[]

  /** WHERE clause condition */
  where?: WhereCondition

  /** Array of JOIN configurations */
  joins?: Array<{
    type: JoinType
    table: string
    condition: string
  }>

  /** Array of columns to GROUP BY */
  groupBy?: string[]

  /** HAVING clause condition */
  having?: WhereCondition

  /** Array of ORDER BY configurations */
  orderBy?: Array<{
    column: string
    direction?: OrderDirection
  }>

  /** Maximum number of rows to return */
  limit?: number

  /** Number of rows to skip */
  offset?: number
}
