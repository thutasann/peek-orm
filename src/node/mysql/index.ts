import { connectMySQL, closeMySQL, createTable } from '../../build/Release/peek-orm.node'
import { CreateTableParams, ConnectParams } from '../types/mysql-types'

/**
 * MySQL Client
 */
export class MySQL {
  private static instance: MySQL
  private isConnected: boolean = false

  private constructor() {}

  /**
   * Get MySQL client instance
   */
  static client(): MySQL {
    if (!MySQL.instance) {
      MySQL.instance = new MySQL()
    }
    return MySQL.instance
  }

  /**
   * Connect to MySQL database
   */
  async connect(config: ConnectParams): Promise<MySQL> {
    const { host, user, password, database } = config
    this.isConnected = connectMySQL(host, user, password, database)

    if (!this.isConnected) {
      throw new Error('Failed to connect to MySQL database')
    }

    return this
  }

  /**
   * Close MySQL connection
   */
  async disconnect(): Promise<void> {
    if (this.isConnected) {
      closeMySQL()
      this.isConnected = false
    }
  }

  /**
   * Create a table
   * @param params - Create table params
   * @returns {Promise<boolean>} - True if table created successfully, false otherwise
   */
  async createTable(params: CreateTableParams): Promise<boolean> {
    const { name, columns } = params
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

    return createTable(name, columnDefinitions)
  }

  /**
   * Check if connected to database
   */
  get connected(): boolean {
    return this.isConnected
  }
}
