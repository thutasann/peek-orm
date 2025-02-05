import { QueryBuilder } from '../../types'
import { COLORS } from '../../utils/logger'
import { BuildQueryHelper } from './build-query-helper'

/**
 * MySQL Query Builder Implementation
 * @description This is the internal query builder class
 * @version 0.0.1
 * @author [thutasann](https://github.com/thutasann)
 * @template T - Type of the entity being queried
 */
export class MySQLQueryBuilder<T = any> implements QueryBuilder<T> {
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
  public bulkInsertValues?: { columns: string[]; values: any[][] }
  public updatedValues?: { columns: string[]; where: Partial<T>; values: any[][] }
  public deletedValues?: { where: Partial<T> }

  select(columns: '*' | keyof T | Array<keyof T>): QueryBuilder<T> {
    if (columns === '*') {
      this.selectedColumns = ['*']
    } else {
      this.selectedColumns = Array.isArray(columns) ? columns : [columns]
    }
    return this
  }

  native(query: string): QueryBuilder<T> {
    this.nativeQuery = query
    return this
  }

  from(table: string): QueryBuilder<T> {
    this.tableName = table
    return this
  }

  where(condition: string | object): QueryBuilder<T> {
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

  andWhere(condition: string | object): QueryBuilder<T> {
    return this.where(condition)
  }

  orWhere(condition: string | object): QueryBuilder<T> {
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

  join(table: string, condition: string): QueryBuilder<T> {
    this.joinClauses.push(`JOIN ${table} ON ${condition}`)
    return this
  }

  leftJoin(table: string, condition: string): QueryBuilder<T> {
    this.joinClauses.push(`LEFT JOIN ${table} ON ${condition}`)
    return this
  }

  rightJoin(table: string, condition: string): QueryBuilder<T> {
    this.joinClauses.push(`RIGHT JOIN ${table} ON ${condition}`)
    return this
  }

  innerJoin(table: string, condition: string): QueryBuilder<T> {
    this.joinClauses.push(`INNER JOIN ${table} ON ${condition}`)
    return this
  }

  groupBy(columns: string | string[]): QueryBuilder<T> {
    this.groupByColumns = Array.isArray(columns) ? columns : [columns]
    return this
  }

  having(condition: string | object): QueryBuilder<T> {
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

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): QueryBuilder<T> {
    this.orderByStatements.push(`${column} ${direction}`)
    return this
  }

  limit(limit: number): QueryBuilder<T> {
    this.limitValue = limit
    return this
  }

  offset(offset: number): QueryBuilder<T> {
    this.offsetValue = offset
    return this
  }

  insert<R extends Partial<T>>(table: string, values: R | R[]): QueryBuilder<T> {
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

  updateOne<R extends Partial<T>>(table: string, where: Partial<T>, values: R | R[]): QueryBuilder<T> {
    this.tableName = table
    const records = Array.isArray(values) ? values : [values]
    this.updatedValues = {
      columns: Object.keys(records[0]),
      where,
      values: records.map((record) => Object.values(record)),
    }
    return this
  }

  updateMany<R extends Partial<T>>(table: string, where: Partial<T>, values: R[]): QueryBuilder<T> {
    this.tableName = table
    const records = Array.isArray(values) ? values : [values]
    this.updatedValues = {
      columns: Object.keys(records[0]),
      where,
      values: records.map((record) => Object.values(record)),
    }
    return this
  }

  delete(table: string, where: Partial<T>): QueryBuilder<T> {
    this.tableName = table
    this.deletedValues = {
      where,
    }
    return this
  }

  bulkInsert(tableName: string, values: any[]): QueryBuilder<T> {
    this.tableName = tableName
    const records = Array.isArray(values) ? values : [values]
    if (records.length === 0) throw new Error('At least one record must be provided for bulk insert')

    const columns = Object.keys(records[0])
    if (columns.length === 0) throw new Error('Records must contain at least one column')

    this.bulkInsertValues = {
      columns,
      values: records.map((record) => {
        return Object.values(record).map((value) => {
          if (value === null) return null
          if (typeof value === 'string') return `'${value}'`
          if (typeof value === 'boolean') return value ? 1 : 0
          return value
        })
      }),
    }
    return this
  }

  getQuery(): string {
    if (this.nativeQuery) return this.nativeQuery
    if (!this.tableName) throw new Error('Table name must be specified using from() method')

    // INSERT Query
    if (this.insertedValues) {
      const insertQuery = BuildQueryHelper.buildInsertQuery(this.tableName, this.insertedValues)
      console.log(`${COLORS.green}[INSERT]${COLORS.reset}: ${insertQuery}`)
      return insertQuery + ';'
    }

    // BULK INSERT Query
    if (this.bulkInsertValues) {
      const bulkInsertQuery = BuildQueryHelper.buildBulkInsertQuery(this.tableName, this.bulkInsertValues)
      console.log(`${COLORS.greenBright}[BULK INSERT]${COLORS.reset}: ${bulkInsertQuery}`)
      return bulkInsertQuery + ';'
    }

    // UPDATE Query
    if (this.updatedValues) {
      const updateQuery = BuildQueryHelper.buildUpdateQuery(this.tableName, this.updatedValues)
      console.log(`${COLORS.greenBright}[UPDATE]${COLORS.reset}: ${updateQuery}`)
      return updateQuery + ';'
    }

    // DELETE Query
    if (this.deletedValues) {
      const deleteQuery = BuildQueryHelper.buildDeleteQuery(this.tableName, this.deletedValues)
      console.log(`${COLORS.red}[DELETE]${COLORS.reset}: ${deleteQuery}`)
      return deleteQuery + ';'
    }

    const selectQuery = BuildQueryHelper.buildSelectQuery(this).join(' ')
    console.log(`${COLORS.blue}[SELECT]${COLORS.reset}: ${selectQuery}`)
    return selectQuery + ';'
  }
}

/**
 * Create a new query builder instance
 * @template T - Type of the entity being queried
 * @returns {QueryBuilder<T>} - A new query builder instance
 */
export function createQueryBuilder<T>(): QueryBuilder<T> {
  return new MySQLQueryBuilder<T>()
}
