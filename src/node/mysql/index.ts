import { connectMySQL, closeMySQL } from '../../build/Release/peek-orm.node'

/**
 * MySQL Functions
 */
export class MySQL {
  /** Connect to MySQL */
  static connectMySQL(host: string, user: string, password: string, database: string): boolean {
    return connectMySQL(host, user, password, database)
  }

  /** Close MySQL connection */
  static closeMySQL(): boolean {
    return closeMySQL()
  }
}
