/**
 * Type definition for WHERE clause conditions
 * Accepts either an object of key-value pairs or a raw SQL string
 */
export type WhereCondition<T> =
  | {
      [key in keyof T]?: any
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
export interface SelectOptions<T> {
  /** Whether to use SELECT DISTINCT */
  distinct?: boolean

  /** Array of columns to select */
  columns?: string[]

  /** WHERE clause condition */
  where?: WhereCondition<T>

  /** Array of JOIN configurations */
  joins?: Array<{
    type: JoinType
    table: string
    condition: string
  }>

  /** Array of columns to GROUP BY */
  groupBy?: string[]

  /** HAVING clause condition */
  having?: WhereCondition<T>

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

export interface InsertOptions<T> {
  columns?: string[]
  values?: T[]
}
