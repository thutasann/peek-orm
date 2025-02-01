import { MySQLColumnType } from './column-type.type'

/**
 * Column definition for table creation
 */
export type ColumnDefinition<TName> = {
  /**
   * Column name
   */
  name: TName
  /**
   * Column type
   */
  type: MySQLColumnType
  /**
   * Column length
   */
  length?: number
  /**
   * Primary key
   */
  primaryKey?: boolean
  /**
   * Auto increment
   */
  autoIncrement?: boolean
  /**
   * Unique
   */
  unique?: boolean
  /**
   * Nullable
   */
  nullable?: boolean
  /**
   * Scale
   */
  scale?: number
  /**
   * Precision
   */
  precision?: number
  /**
   * Default value
   */
  default?: string | number | boolean
  /**
   * Reference to another table
   */
  reference?: {
    table: string
    column: string
  }
  /**
   * On delete
   */
  onDelete?: 'CASCADE' | 'SET NULL' | 'NO ACTION' | 'RESTRICT'
  /**
   * On update
   */
  onUpdate?: 'CASCADE' | 'SET NULL' | 'NO ACTION' | 'RESTRICT'
}

/**
 * Create index params
 */
export type CreateIndexParams<T> = {
  /**
   * Index name
   */
  indexName: string
  /**
   * Columns
   */
  columns: (keyof T)[]
}

/**
 * Create table params
 */
export type CreateTableParams<T extends Record<string, unknown>> = {
  /**
   * Table name
   */
  name: string
  /**
   * Columns Definition
   */
  columns: ColumnDefinition<keyof T>[]
  /**
   * Indexes
   */
  indexes?: CreateIndexParams<T>[]
}
