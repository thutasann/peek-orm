export interface SelectQueryBuilder<T = any> {
  // Basic SELECT operations
  select(columns: string | string[]): SelectQueryBuilder<T>
  from(table: string): SelectQueryBuilder<T>

  // WHERE conditions
  where(condition: string | object): SelectQueryBuilder<T>
  andWhere(condition: string | object): SelectQueryBuilder<T>
  orWhere(condition: string | object): SelectQueryBuilder<T>

  // JOIN operations
  join(table: string, condition: string): SelectQueryBuilder<T>
  leftJoin(table: string, condition: string): SelectQueryBuilder<T>
  rightJoin(table: string, condition: string): SelectQueryBuilder<T>
  innerJoin(table: string, condition: string): SelectQueryBuilder<T>

  // GROUP BY and HAVING
  groupBy(columns: string | string[]): SelectQueryBuilder<T>
  having(condition: string | object): SelectQueryBuilder<T>

  // ORDER BY and LIMIT
  orderBy(column: string, direction?: 'ASC' | 'DESC'): SelectQueryBuilder<T>
  limit(limit: number): SelectQueryBuilder<T>
  offset(offset: number): SelectQueryBuilder<T>

  // Execution methods
  getQuery(): string
  execute(): Promise<T[]>
  getOne(): Promise<T | null>
  getCount(): Promise<number>
}

// Additional types for type safety
export type WhereCondition =
  | {
      [key: string]: any
    }
  | string

export type OrderDirection = 'ASC' | 'DESC'

export type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL OUTER'

export interface SelectOptions {
  distinct?: boolean
  columns?: string[]
  where?: WhereCondition
  joins?: Array<{
    type: JoinType
    table: string
    condition: string
  }>
  groupBy?: string[]
  having?: WhereCondition
  orderBy?: Array<{
    column: string
    direction?: OrderDirection
  }>
  limit?: number
  offset?: number
}
