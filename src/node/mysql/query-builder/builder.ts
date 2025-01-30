import { SelectQueryBuilder } from '../../types'
import { BuildQueryHelper } from './build-query-helper'

/**
 * MySQL Query Builder Implementation
 * @template T - Type of the entity being queried
 */
export class MySQLQueryBuilder<T = any> implements SelectQueryBuilder<T> {
  public selectedColumns: Array<keyof T | '*'> = ['*']
  public tableName: string = ''
  public whereConditions: string[] = []
  public joinClauses: string[] = []
  public groupByColumns: string[] = []
  public havingConditions: string[] = []
  public orderByStatements: string[] = []
  public limitValue?: number
  public offsetValue?: number
  public nativeQuery?: string
  public insertedValues?: { columns: string[]; values: any[][] }

  select(columns: '*' | keyof T | Array<keyof T>): SelectQueryBuilder<T> {
    if (columns === '*') {
      this.selectedColumns = ['*']
    } else {
      this.selectedColumns = Array.isArray(columns) ? columns : [columns]
    }
    return this
  }

  native(query: string): SelectQueryBuilder<T> {
    this.nativeQuery = query
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

  insert<R extends Partial<T>>(table: string, values: R | R[]): SelectQueryBuilder<T> {
    this.tableName = table
    const records = Array.isArray(values) ? values : [values]
    if (records.length === 0) throw new Error('At least one record must be provided for insert')

    const columns = Object.keys(records[0])
    if (columns.length === 0) throw new Error('Records must contain at least one column')

    const rows = records.map((record) => {
      return columns.map((col) => {
        const value = record[col as keyof typeof record]
        return typeof value === 'string' ? `'${value}'` : value
      })
    })

    this.insertedValues = {
      columns,
      values: rows,
    }

    return this
  }

  getQuery(): string {
    if (this.nativeQuery) return this.nativeQuery
    if (!this.tableName) throw new Error('Table name must be specified using from() method')

    const parts = this.insertedValues
      ? [BuildQueryHelper.buildInsertQuery(this.tableName, this.insertedValues)]
      : BuildQueryHelper.buildSelectQuery(this)

    return parts.join(' ') + ';'
  }
}

/**
 * Create a new query builder instance
 * @template T - Type of the entity being queried
 * @returns {SelectQueryBuilder<T>} - A new query builder instance
 */
export function createQueryBuilder<T>(): SelectQueryBuilder<T> {
  return new MySQLQueryBuilder<T>()
}
