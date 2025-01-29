import { connectMySQL, closeMySQL } from '../../build/Release/peek-orm.node'

/**
 * MySQL connection parameters
 */
export type ConnectParams = {
  /**
   * MySQL host
   */
  host: string
  /**
   * MySQL user
   */
  user: string
  /**
   * MySQL password
   */
  password: string
  /**
   * MySQL database
   */
  database: string
}

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
   * Check if connected to database
   */
  get connected(): boolean {
    return this.isConnected
  }
}
