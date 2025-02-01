import fs, { readdirSync } from 'fs'
import { join, resolve } from 'path'
import {
  cleanup as cleanupFn,
  closeMySQL,
  createIndex,
  createTable,
  initialize,
} from '../../build/Release/peek-orm.node'
import { ConnectParams, CreateTableParams } from '../types/mysql-types'
import { COLORS, logger } from '../utils/logger'
import { CacheManager } from './cache-manager'

/**
 * MySQL Client
 * @description This is the MySQL client class that connects to the database and creates tables from `.peek.ts` schema files
 * @version 0.0.1
 * @author [thutasann](https://github.com/thutasann)
 */
export class MySQL {
  private static instance: MySQL
  private isConnected: boolean = false
  private cacheManager: CacheManager

  private constructor() {
    this.cacheManager = new CacheManager()
  }

  /**
   * Create a table
   * @param params - Create table params
   * @returns {Promise<boolean>} True if table created successfully, false otherwise
   */
  private async createTable(params: CreateTableParams<Record<any, any>>): Promise<boolean> {
    const { name, columns, indexes } = params
    const foreignKeys: string[] = []

    const columnDefinitions = columns
      .map((column) => {
        let def = `${column.name} ${column.type}`

        if (column.length) {
          def += `(${column.length})`
        }

        if (column.primaryKey) {
          def += ' PRIMARY KEY'
        }

        if (column.autoIncrement) {
          def += ' AUTO_INCREMENT'
        }

        if (column.unique) {
          def += ' UNIQUE'
        }

        if (!column.nullable) {
          def += ' NOT NULL'
        }

        if (column.default !== undefined) {
          def += ` DEFAULT ${typeof column.default === 'string' ? `'${column.default}'` : column.default}`
        }

        if (column.reference) {
          const onDelete = column.onDelete || 'CASCADE'
          const onUpdate = column.onUpdate || 'CASCADE'
          foreignKeys.push(
            `FOREIGN KEY (${column.name}) REFERENCES ${column.reference.table}(${column.reference.column}) ` +
              `ON DELETE ${onDelete} ON UPDATE ${onUpdate}`,
          )
        }

        return def
      })
      .join(', ')

    const tableDefinition =
      foreignKeys.length > 0 ? `${columnDefinitions}, ${foreignKeys.join(', ')}` : columnDefinitions

    const create_table_result = await createTable(name, tableDefinition)
    if (create_table_result) {
      if (indexes) {
        for (const index of indexes) {
          const formattedColumns = index.columns.join(', ')
          try {
            const result = await createIndex(name, index.indexName, formattedColumns)
            if (result) {
              console.log(
                `${COLORS.greenBright}[INDEX] ${index.indexName} created successfully on table ${COLORS.blue}${name}${COLORS.reset}`,
              )
            } else {
              console.log(
                `${COLORS.red}[INDEX] ${index.indexName} already exists on table ${COLORS.blue}${name}${COLORS.reset}`,
              )
            }
          } catch (error) {
            logger.error(`Failed to create index ${index.indexName}:`, error)
          }
        }
      }
    } else {
      throw new Error(`Failed to create table ${name}: ${create_table_result}`)
    }
    return create_table_result
  }

  /**
   * Discover and create tables from .peek.js schema files
   * @param schemaDir - Directory containing .peek.js schema files
   * @returns {Promise<Record<string, boolean>>} Object with table names as keys and creation status as values
   */
  private async createTablesFromSchemas(schemaDir: string): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}
    const schemaCache = this.cacheManager.readSchemaCache()
    const newSchemaCache = new Map<string, any>()

    try {
      const fullPath = resolve(schemaDir)
      await fs.promises.access(fullPath, fs.constants.R_OK)

      const schemaFiles = readdirSync(fullPath).filter((file) => file.endsWith('.peek.js') || file.endsWith('.peek.ts'))

      if (schemaFiles.length === 0) {
        logger.warning(`No .peek.js or .peek.ts schema files found in ${schemaDir}`)
        return results
      }

      for (const file of schemaFiles) {
        const filePath = join(fullPath, file)
        try {
          const stats = fs.statSync(filePath)
          const cachedSchema = schemaCache.get(filePath)

          if (!cachedSchema || cachedSchema.mtime !== stats.mtime.toISOString()) {
            delete require.cache[require.resolve(filePath)]
            const schema = require(filePath)
            newSchemaCache.set(filePath, {
              mtime: stats.mtime.toISOString(),
              schema,
            })

            for (const key in schema) {
              const tableSchema = schema[key]
              if (tableSchema && typeof tableSchema === 'object' && tableSchema.name && tableSchema.columns) {
                results[tableSchema.name] = await this.createTable(tableSchema)
                logger.success(`Table ${COLORS.blue}${tableSchema.name}${COLORS.reset} created/updated from ${file}`)
              }
            }
          } else {
            newSchemaCache.set(filePath, cachedSchema)
            for (const key in cachedSchema.schema) {
              const tableSchema = cachedSchema.schema[key]
              if (tableSchema && typeof tableSchema === 'object' && tableSchema.name && tableSchema.columns) {
                results[tableSchema.name] = await this.createTable(tableSchema)
                logger.success(`Table ${COLORS.blue}${tableSchema.name}${COLORS.reset} loaded from cache`)
              }
            }
          }
        } catch (error) {
          logger.error(`Failed to process schema file ${file}:`, error)
        }
      }

      this.cacheManager.writeSchemaCache(newSchemaCache)
    } catch (error) {
      logger.error('Failed to read schema directory:', error)
    }

    return results
  }

  /**
   * Get MySQL client instance
   * @description Singleton MySQL client instance
   * @returns {MySQL} MySQL client instance
   */
  static client(): MySQL {
    if (!MySQL.instance) {
      MySQL.instance = new MySQL()
    }
    return MySQL.instance
  }

  /**
   * ## Connect Method
   * - Connect to MySQL database
   * - Create tables from .peek.js schema files
   * @param config - Connect params
   * @param schemasDir - Directory containing .peek.js schema files
   * @returns {Promise<MySQL>} - MySQL client instance
   */
  async connect(config: ConnectParams, schemasDir: string): Promise<MySQL> {
    const { host, user, password, database } = config
    this.isConnected = await initialize(host, user, password, database, 3306)

    if (this.isConnected) {
      console.log(`\n${COLORS.greenBright}🚀 Connected to MySQL database`)
      await this.createTablesFromSchemas(schemasDir)
    } else {
      console.log(`\n${COLORS.red}🚨 Failed to connect to MySQL database`)
      throw new Error('🚨 Failed to connect to MySQL database')
    }

    return this
  }

  /**
   * ## Cleanup Method
   * - Cleanup MySQL connection
   * @returns {Promise<boolean>} True if cleanup successful, false otherwise
   */
  async cleanup(): Promise<boolean> {
    return await cleanupFn()
  }

  /**
   * ## Disconnect Method
   * - Close MySQL connection
   * @returns {Promise<void>} Promise that resolves when the connection is closed
   */
  async disconnect(): Promise<void> {
    if (this.isConnected) {
      closeMySQL()
      this.isConnected = false
    }
  }

  /**
   * ## Check if connected to database
   * @returns {boolean} True if connected to database, false otherwise
   */
  get connected(): boolean {
    return this.isConnected
  }
}
