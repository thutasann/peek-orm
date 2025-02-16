import { MySQLQueryBuilder } from './builder'

/**
 * ## Build Query Helper
 * - This is the internal query builder class for the MySQL client
 * @version 0.0.1
 * @author [thutasann](https://github.com/thutasann)
 */
export class BuildQueryHelper {
  private static addJoinClauses(parts: string[], joinClauses: string[]): void {
    if (joinClauses.length > 0) {
      parts.push(joinClauses.join(' '))
    }
  }

  private static addWhereClause(parts: string[], whereConditions: string[]): void {
    if (whereConditions.length > 0) {
      parts.push(`WHERE ${whereConditions.join(' AND ')}`)
    }
  }

  private static addGroupByClause(parts: string[], groupByColumns: string[]): void {
    if (groupByColumns.length > 0) {
      parts.push(`GROUP BY ${groupByColumns.join(', ')}`)
    }
  }

  private static addHavingClause(parts: string[], havingConditions: string[]): void {
    if (havingConditions.length > 0) {
      parts.push(`HAVING ${havingConditions.join(' AND ')}`)
    }
  }

  private static addOrderByClause(parts: string[], orderByStatements: string[]): void {
    if (orderByStatements.length > 0) {
      const orderByCols = orderByStatements.map((stmt) => {
        const [col, direction] = stmt.split(' ')
        return `${col} ${direction}`
      })
      parts.push(`ORDER BY ${orderByCols.join(', ')}`)
    }
  }

  private static addLimitClause(parts: string[], limitValue?: number): void {
    if (limitValue !== undefined) {
      if (!Number.isInteger(limitValue) || limitValue < 0) {
        throw new Error('LIMIT value must be a non-negative integer')
      }
      parts.push(`LIMIT ${limitValue}`)
    }
  }

  private static addOffsetClause(parts: string[], offsetValue?: number): void {
    if (offsetValue !== undefined) {
      if (!Number.isInteger(offsetValue) || offsetValue < 0) {
        throw new Error('OFFSET value must be a non-negative integer')
      }
      parts.push(`OFFSET ${offsetValue}`)
    }
  }

  /**
   * Build an INSERT query
   * @param tableName - Name of the table to insert into
   * @param insertedValues - Insert values
   * @returns INSERT query
   */
  static buildInsertQuery(tableName: string, insertedValues: { columns: string[]; values: any[][] }): string {
    const { columns, values } = insertedValues
    const columnsList = columns.join(', ')
    const valuesList = values.map((row) => `(${row.join(', ')})`).join(', ')
    return `INSERT INTO ${tableName} (${columnsList}) VALUES ${valuesList}`
  }

  /**
   * Build a BULK INSERT query
   * @param tableName - Name of the table to insert into
   * @param data - Bulk insert data
   * @returns BULK INSERT query
   */
  static buildBulkInsertQuery(tableName: string, data: { columns: string[]; values: any[][] }): string {
    const columns = `(${data.columns.join(', ')})`
    const values = data.values
      .map((row) => `(${row.map((value) => (value === null ? 'NULL' : value)).join(', ')})`)
      .join(', ')

    return `INSERT INTO ${tableName} ${columns} VALUES ${values}`
  }

  /**
   * Build an UPDATE query
   * @param tableName - Name of the table to update
   * @param updateValues - Update values
   * @returns UPDATE query
   */
  static buildUpdateQuery(tableName: string, updateValues: { columns: string[]; where: any; values: any[][] }): string {
    const { columns, where, values } = updateValues
    const setStatements = columns
      .map((col, index) => {
        const value = values[0][index]
        return `${col} = ${typeof value === 'string' ? `'${value}'` : value === 'NULL' ? 'NULL' : value}`
      })
      .join(', ')

    const whereConditions = Object.entries(where)
      .map(([key, value]) => `${key} = ${value === 'NULL' ? 'NULL' : typeof value === 'string' ? `'${value}'` : value}`)
      .join(' AND ')

    return `UPDATE ${tableName} SET ${setStatements} WHERE ${whereConditions}`
  }

  /**
   * Build a DELETE query
   * @param tableName - Name of the table to delete from
   * @param where - Where clause
   * @returns DELETE query
   */
  static buildDeleteQuery(tableName: string, deletedValues: { where: Record<string, any> }): string {
    const { where } = deletedValues
    const whereConditions = Object.entries(where)
      .map(([key, value]) => {
        if (value === null || value === 'NULL') {
          return `${key} IS NULL`
        }
        return `${key} = ${typeof value === 'string' ? `'${value}'` : value}`
      })
      .join(' AND ')
    return `DELETE FROM ${tableName} WHERE ${whereConditions}`
  }

  /**
   * Build a SELECT query
   * @param builder - Query builder
   * @returns SELECT query
   */
  static buildSelectQuery(builder: MySQLQueryBuilder): string[] {
    const parts: string[] = []

    // Select and From clauses
    const columns = builder.selectedColumns
    const selectClause =
      columns.length === 1 && columns[0] === '*' ? '*' : columns.map((col) => col.toString().trim()).join(', ')
    parts.push(`SELECT ${selectClause}`)
    parts.push(`FROM ${builder.tableName}`)

    // Optional clauses
    this.addJoinClauses(parts, builder.joinClauses)
    this.addWhereClause(parts, builder.whereConditions)
    this.addGroupByClause(parts, builder.groupByColumns)
    this.addHavingClause(parts, builder.havingConditions)
    this.addOrderByClause(parts, builder.orderByStatements)
    this.addLimitClause(parts, builder.limitValue)
    this.addOffsetClause(parts, builder.offsetValue)

    return parts
  }
}
