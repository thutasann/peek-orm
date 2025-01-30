import { SelectQueryBuilder } from '../types'

/**
 * MySQL Query Builder Implementation
 * @template T - Type of the entity being queried
 */
class MySQLQueryBuilder<T = any> implements SelectQueryBuilder<T> {
  private selectedColumns: Array<keyof T | '*'> = ['*']
  private tableName: string = ''
  private whereConditions: string[] = []
  private joinClauses: string[] = []
  private groupByColumns: string[] = []
  private havingConditions: string[] = []
  private orderByStatements: string[] = []
  private limitValue?: number
  private offsetValue?: number

  /**
   * Specify columns to select
   */
  select(columns: '*' | keyof T | Array<keyof T>): SelectQueryBuilder<T> {
    if (columns === '*') {
      this.selectedColumns = ['*']
    } else {
      this.selectedColumns = Array.isArray(columns) ? columns : [columns]
    }
    return this
  }

  /**
   * Specify the table to query from
   */
  from(table: string): SelectQueryBuilder<T> {
    this.tableName = table
    return this
  }

  /**
   * Add WHERE condition
   */
  where(condition: string | object): SelectQueryBuilder<T> {
    if (typeof condition === 'string') {
      this.whereConditions.push(condition)
    } else {
      const conditions = Object.entries(condition).map(([key, value]) => {
        return `${key} = ${typeof value === 'string' ? `'${value}'` : value}`
      })
      this.whereConditions.push(...conditions)
    }
    return this
  }

  /**
   * Add AND WHERE condition
   */
  andWhere(condition: string | object): SelectQueryBuilder<T> {
    return this.where(condition)
  }

  /**
   * Add OR WHERE condition
   */
  orWhere(condition: string | object): SelectQueryBuilder<T> {
    if (this.whereConditions.length === 0) {
      return this.where(condition)
    }

    if (typeof condition === 'string') {
      this.whereConditions[this.whereConditions.length - 1] += ` OR ${condition}`
    } else {
      const conditions = Object.entries(condition)
        .map(([key, value]) => {
          return `${key} = ${typeof value === 'string' ? `'${value}'` : value}`
        })
        .join(' OR ')
      this.whereConditions[this.whereConditions.length - 1] += ` OR ${conditions}`
    }
    return this
  }

  /**
   * Add JOIN clause
   */
  join(table: string, condition: string): SelectQueryBuilder<T> {
    this.joinClauses.push(`JOIN ${table} ON ${condition}`)
    return this
  }

  /**
   * Add LEFT JOIN clause
   */
  leftJoin(table: string, condition: string): SelectQueryBuilder<T> {
    this.joinClauses.push(`LEFT JOIN ${table} ON ${condition}`)
    return this
  }

  /**
   * Add RIGHT JOIN clause
   */
  rightJoin(table: string, condition: string): SelectQueryBuilder<T> {
    this.joinClauses.push(`RIGHT JOIN ${table} ON ${condition}`)
    return this
  }

  /**
   * Add INNER JOIN clause
   */
  innerJoin(table: string, condition: string): SelectQueryBuilder<T> {
    this.joinClauses.push(`INNER JOIN ${table} ON ${condition}`)
    return this
  }

  /**
   * Add GROUP BY clause
   */
  groupBy(columns: string | string[]): SelectQueryBuilder<T> {
    this.groupByColumns = Array.isArray(columns) ? columns : [columns]
    return this
  }

  /**
   * Add HAVING clause
   */
  having(condition: string | object): SelectQueryBuilder<T> {
    if (typeof condition === 'string') {
      this.havingConditions.push(condition)
    } else {
      const conditions = Object.entries(condition).map(([key, value]) => {
        return `${key} = ${typeof value === 'string' ? `'${value}'` : value}`
      })
      this.havingConditions.push(...conditions)
    }
    return this
  }

  /**
   * Add ORDER BY clause
   */
  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): SelectQueryBuilder<T> {
    this.orderByStatements.push(`${column} ${direction}`)
    return this
  }

  /**
   * Add LIMIT clause
   */
  limit(limit: number): SelectQueryBuilder<T> {
    this.limitValue = limit
    return this
  }

  /**
   * Add OFFSET clause
   */
  offset(offset: number): SelectQueryBuilder<T> {
    this.offsetValue = offset
    return this
  }

  /**
   * Get the final SQL query string
   */
  getQuery(): string {
    const parts: string[] = []

    // SELECT clause
    parts.push(`SELECT ${this.selectedColumns.join(', ')}`)

    // FROM clause
    parts.push(`FROM ${this.tableName}`)

    // JOIN clauses
    if (this.joinClauses.length > 0) {
      parts.push(this.joinClauses.join(' '))
    }

    // WHERE clause
    if (this.whereConditions.length > 0) {
      parts.push(`WHERE ${this.whereConditions.join(' AND ')}`)
    }

    // GROUP BY clause
    if (this.groupByColumns.length > 0) {
      parts.push(`GROUP BY ${this.groupByColumns.join(', ')}`)
    }

    // HAVING clause
    if (this.havingConditions.length > 0) {
      parts.push(`HAVING ${this.havingConditions.join(' AND ')}`)
    }

    // ORDER BY clause
    if (this.orderByStatements.length > 0) {
      parts.push(`ORDER BY ${this.orderByStatements.join(', ')}`)
    }

    // LIMIT and OFFSET
    if (this.limitValue !== undefined) {
      parts.push(`LIMIT ${this.limitValue}`)
    }
    if (this.offsetValue !== undefined) {
      parts.push(`OFFSET ${this.offsetValue}`)
    }

    const finalQuery = parts.join(' ')
    console.log('SELECT query ==>', finalQuery)

    return finalQuery
  }

  /**
   * Execute the query (to be implemented in MySQL class)
   */
  execute(): Promise<T[]> {
    throw new Error('Execute method should be called through MySQL client')
  }

  /**
   * Get one result (to be implemented in MySQL class)
   */
  getOne(): Promise<T | null> {
    throw new Error('GetOne method should be called through MySQL client')
  }

  /**
   * Get count (to be implemented in MySQL class)
   */
  getCount(): Promise<number> {
    throw new Error('GetCount method should be called through MySQL client')
  }
}

/**
 * Create a new query builder instance
 */
export function createQueryBuilder<T>(): SelectQueryBuilder<T> {
  return new MySQLQueryBuilder<T>()
}
