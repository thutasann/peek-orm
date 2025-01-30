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
  /**
   * MySQL port
   */
  port: number
}
