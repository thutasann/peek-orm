import { SelectQueryBuilder } from '../../types'
import { logger } from '../../utils/logger'

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

  select(columns: '*' | keyof T | Array<keyof T>): SelectQueryBuilder<T> {
    if (columns === '*') {
      this.selectedColumns = ['*']
    } else {
      this.selectedColumns = Array.isArray(columns) ? columns : [columns]
    }
    return this
  }

  from(table: string): SelectQueryBuilder<T> {
    this.tableName = table
    return this
  }

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

  andWhere(condition: string | object): SelectQueryBuilder<T> {
    return this.where(condition)
  }

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

  join(table: string, condition: string): SelectQueryBuilder<T> {
    this.joinClauses.push(`JOIN ${table} ON ${condition}`)
    return this
  }

  leftJoin(table: string, condition: string): SelectQueryBuilder<T> {
    this.joinClauses.push(`LEFT JOIN ${table} ON ${condition}`)
    return this
  }

  rightJoin(table: string, condition: string): SelectQueryBuilder<T> {
    this.joinClauses.push(`RIGHT JOIN ${table} ON ${condition}`)
    return this
  }

  innerJoin(table: string, condition: string): SelectQueryBuilder<T> {
    this.joinClauses.push(`INNER JOIN ${table} ON ${condition}`)
    return this
  }

  groupBy(columns: string | string[]): SelectQueryBuilder<T> {
    this.groupByColumns = Array.isArray(columns) ? columns : [columns]
    return this
  }

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

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): SelectQueryBuilder<T> {
    this.orderByStatements.push(`${column} ${direction}`)
    return this
  }

  limit(limit: number): SelectQueryBuilder<T> {
    this.limitValue = limit
    return this
  }

  offset(offset: number): SelectQueryBuilder<T> {
    this.offsetValue = offset
    return this
  }

  getQuery(): string {
    if (!this.tableName) throw new Error('Table name must be specified using from() method')

    const parts: string[] = []

    // SELECT clause
    const columns = this.selectedColumns.map((col) => {
      return col === '*' ? col : col.toString()
    })
    parts.push(`SELECT ${columns.join(', ')}`)

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
      const orderByCols = this.orderByStatements.map((stmt) => {
        const [col, direction] = stmt.split(' ')
        return `${col} ${direction}`
      })
      parts.push(`ORDER BY ${orderByCols.join(', ')}`)
    }

    // LIMIT and OFFSET
    if (this.limitValue !== undefined) {
      if (!Number.isInteger(this.limitValue) || this.limitValue < 0) {
        throw new Error('LIMIT value must be a non-negative integer')
      }
      parts.push(`LIMIT ${this.limitValue}`)
    }

    if (this.offsetValue !== undefined) {
      if (!Number.isInteger(this.offsetValue) || this.offsetValue < 0) {
        throw new Error('OFFSET value must be a non-negative integer')
      }
      parts.push(`OFFSET ${this.offsetValue}`)
    }

    const finalQuery = parts.join(' ') + ';'
    logger.info('SELECT QUERY: ', finalQuery)

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
