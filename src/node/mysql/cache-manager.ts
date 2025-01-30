import fs from 'fs'
import { join } from 'path'
import { logger } from '../utils/logger'

/**
 * ## Cache Manager
 * - Read and write table and schema caches to file
 * - This is the internal cache manager class for the MySQL client
 * @version 0.0.1
 * @author [thutasann](https://github.com/thutasann)
 */
export class CacheManager {
  private readonly cacheFolderPath: string = '.peek-cache'
  private readonly schemaCacheFile: string = join(this.cacheFolderPath, 'schema-caches.json')

  constructor() {
    if (!fs.existsSync(this.cacheFolderPath)) {
      fs.mkdirSync(this.cacheFolderPath, { recursive: true })
    }
  }

  /**
   * Read schema cache from file
   * @returns {Map<string, any>} Schema cache map
   */
  readSchemaCache(): Map<string, any> {
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
  writeSchemaCache(cache: Map<string, any>): void {
    try {
      const cacheData = Object.fromEntries(cache)
      fs.writeFileSync(this.schemaCacheFile, JSON.stringify(cacheData, null, 2))
    } catch (error) {
      logger.error('Failed to write schema cache file:', error)
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    try {
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
}
