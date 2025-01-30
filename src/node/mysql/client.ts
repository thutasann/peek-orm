import fs, { readdirSync } from 'fs'
import { join, resolve } from 'path'
import { cleanup as cleanupFn, closeMySQL, createTable, initialize } from '../../build/Release/peek-orm.node'
import { ConnectParams, CreateTableParams } from '../types/mysql-types'
import { logger } from '../utils/logger'

/**
 * MySQL Client
 * - Connect to MySQL database
 * @description Singleton MySQL client instance
 * @author [thutasann](https://github.com/thutasann)
 */
export class MySQL {
  private static instance: MySQL
  private isConnected: boolean = false
  private readonly cacheFolderPath: string = '.peek-cache'
  private readonly tableCacheFile: string = join(this.cacheFolderPath, 'table-caches.json')
  private readonly schemaCacheFile: string = join(this.cacheFolderPath, 'schema-caches.json')

  private constructor() {
    if (!fs.existsSync(this.cacheFolderPath)) {
      fs.mkdirSync(this.cacheFolderPath, { recursive: true })
    }
  }

  /**
   * Read cache from file
   * @returns {Map<string, CreateTableParams<Record<any, any>>>} Cache map
   */
  private readCache(): Map<string, CreateTableParams<Record<any, any>>> {
    try {
      if (fs.existsSync(this.tableCacheFile)) {
        const cacheData = JSON.parse(fs.readFileSync(this.tableCacheFile, 'utf-8'))
        return new Map(Object.entries(cacheData))
      }
    } catch (error) {
      logger.error('Failed to read cache file:', error)
    }
    return new Map()
  }

  /**
   * Write cache to file
   * @param cache - Cache map to write
   */
  private writeCache(cache: Map<string, CreateTableParams<Record<any, any>>>): void {
    try {
      const cacheData = Object.fromEntries(cache)
      fs.writeFileSync(this.tableCacheFile, JSON.stringify(cacheData, null, 2))
    } catch (error) {
      logger.error('Failed to write cache file:', error)
    }
  }

  /**
   * Read schema cache from file
   * @returns {Map<string, any>} Schema cache map
   */
  private readSchemaCache(): Map<string, any> {
    try {
      if (fs.existsSync(this.schemaCacheFile)) {
        const cacheData = JSON.parse(fs.readFileSync(this.schemaCacheFile, 'utf-8'))
        return new Map(Object.entries(cacheData))
      }
    } catch (error) {
      logger.error('Failed to read schema cache file:', error)
    }
    return new Map()
  }

  /**
   * Write schema cache to file
   * @param cache - Schema cache map to write
   */
  private writeSchemaCache(cache: Map<string, any>): void {
    try {
      const cacheData = Object.fromEntries(cache)
      fs.writeFileSync(this.schemaCacheFile, JSON.stringify(cacheData, null, 2))
    } catch (error) {
      logger.error('Failed to write schema cache file:', error)
    }
  }

  /**
   * Create a table
   * @param params - Create table params
   * @returns {Promise<boolean>} True if table created successfully, false otherwise
   */
  private async createTable(params: CreateTableParams<Record<any, any>>): Promise<boolean> {
    const { name, columns } = params
    const cache = this.readCache()
    const cachedTable = cache.get(name)

    if (cachedTable) {
      const columnsChanged = JSON.stringify(cachedTable.columns) !== JSON.stringify(columns)
      if (!columnsChanged) {
        logger.info(`Table ${name} already exists in cache with same schema, skipping creation`)
        return true
      }
      logger.info(`Table ${name} schema has changed, updating...`)
    }

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

        return def
      })
      .join(', ')

    logger.info(`TABLE ${name}`, columnDefinitions)
    const success = createTable(name, columnDefinitions)

    if (success) {
      cache.set(name, params)
      this.writeCache(cache)
    }

    return success
  }

  /**
   * Get cached table schema
   * @param tableName - Name of the table
   * @returns {CreateTableParams<Record<any, any>> | undefined} Table schema if exists in cache
   */
  public getTableSchema(tableName: string): CreateTableParams<Record<any, any>> | undefined {
    const cache = this.readCache()
    return cache.get(tableName)
  }

  /**
   * Discover and create tables from .peek.js schema files
   * @param schemaDir - Directory containing .peek.js schema files
   * @returns {Promise<Record<string, boolean>>} Object with table names as keys and creation status as values
   */
  private async createTablesFromSchemas(schemaDir: string): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}
    const schemaCache = this.readSchemaCache()
    const newSchemaCache = new Map<string, any>()

    try {
      const fullPath = resolve(schemaDir)

      try {
        await fs.promises.access(fullPath, fs.constants.R_OK)
      } catch (error) {
        logger.error(`Schema directory '${schemaDir}' does not exist or is not accessible`)
        throw new Error(`Schema directory '${schemaDir}' does not exist or is not accessible`)
      }

      const schemaFiles = readdirSync(fullPath).filter((file) => file.endsWith('.peek.js') || file.endsWith('.peek.ts'))

      if (schemaFiles.length === 0) {
        logger.warning(`No .peek.js or .peek.ts schema files found in ${schemaDir}`)
        return results
      }

      // First, process all files and update cache
      for (const file of schemaFiles) {
        const filePath = join(fullPath, file)
        try {
          const stats = fs.statSync(filePath)
          const cachedSchema = schemaCache.get(filePath)

          // Process file if it's new or modified
          if (!cachedSchema || cachedSchema.mtime !== stats.mtime.toISOString()) {
            delete require.cache[require.resolve(filePath)] // Clear require cache
            const schema = require(filePath)
            newSchemaCache.set(filePath, {
              mtime: stats.mtime.toISOString(),
              schema,
            })

            for (const key in schema) {
              const tableSchema = schema[key]
              if (tableSchema && typeof tableSchema === 'object' && tableSchema.name && tableSchema.columns) {
                results[tableSchema.name] = await this.createTable(tableSchema)
                logger.success(`Table ${tableSchema.name} created/updated from ${file}\n`)
              }
            }
          } else {
            // Use cached schema
            newSchemaCache.set(filePath, cachedSchema)
            for (const key in cachedSchema.schema) {
              const tableSchema = cachedSchema.schema[key]
              if (tableSchema && typeof tableSchema === 'object' && tableSchema.name && tableSchema.columns) {
                results[tableSchema.name] = await this.createTable(tableSchema)
                logger.success(`Table ${tableSchema.name} loaded from cache\n`)
              }
            }
          }
        } catch (error) {
          logger.error(`Failed to process schema file ${file}:`, error)
        }
      }

      // Update schema cache with all processed files
      this.writeSchemaCache(newSchemaCache)
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
      logger.success('Connected to MySQL database\n')
      await this.createTablesFromSchemas(schemasDir)
    } else {
      logger.error('Failed to connect to MySQL database')
      throw new Error('Failed to connect to MySQL database')
    }

    return this
  }

  /**
   * ## Cleanup Method
   * - Cleanup MySQL connection
   * @returns {Promise<boolean>} True if cleanup successful, false otherwise
   */
  async cleanup(): Promise<boolean> {
    this.clearTableCache()
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
   * Clear all caches
   */
  clearTableCache(): void {
    try {
      if (fs.existsSync(this.tableCacheFile)) {
        fs.unlinkSync(this.tableCacheFile)
      }
      if (fs.existsSync(this.schemaCacheFile)) {
        fs.unlinkSync(this.schemaCacheFile)
      }
      if (fs.existsSync(this.cacheFolderPath) && fs.readdirSync(this.cacheFolderPath).length === 0) {
        fs.rmdirSync(this.cacheFolderPath)
      }
    } catch (error) {
      logger.error('Failed to clear cache files:', error)
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
