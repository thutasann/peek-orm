/** nexium.node module type declarations */
declare module '*.node' {
  /**
   * Initialize MySQL connection
   * @param host - MySQL host
   * @param user - MySQL user
   * @param password - MySQL password
   * @param database - MySQL database
   * @param port - MySQL port
   * @returns {Promise<boolean>} - True if initialization successful, false otherwise
   */
  export async function initialize(
    host: string,
    user: string,
    password: string,
    database: string,
    port: number,
  ): Promise<boolean>

  /**
   * Cleanup MySQL connection
   * @returns {Promise<boolean>} - True if cleanup successful, false otherwise
   */
  export async function cleanup(): Promise<boolean>

  /**
   * Connect to MySQL database
   * @deprecated Use `initialize` instead
   * @param host - MySQL host
   * @param user - MySQL user
   * @param password - MySQL password
   * @param database - MySQL database
   * @returns {Promise<boolean>} - True if connection successful, false otherwise
   */
  export async function connectMySQL(host: string, user: string, password: string, database: string): Promise<boolean>

  /**
   * Close MySQL connection
   * @returns {boolean} - True if connection closed successfully, false otherwise
   */
  export function closeMySQL(): boolean

  /**
   * Create index
   * @param table_name - Table name
   * @param index_name - Index name
   * @param columns - Columns
   * @returns {boolean} - True if index created successfully, false otherwise
   */
  export function createIndex(table_name: string, index_name: string, columns: string): Promise<boolean>

  /**
   * Create table
   * @param table_name - Table name
   * @param column_definitions - Column definitions
   * @returns {boolean} - True if table created successfully, false otherwise
   */
  export function createTable(table_name: string, column_definitions: string): Promise<boolean>

  /**
   * Create trigger
   * @param trigger_name - Trigger name
   * @param table_name - Table name
   * @param event - Trigger event
   * @param statement - Trigger statement
   */
  export function createTrigger(
    trigger_name: string,
    table_name: string,
    event: string,
    statement: string,
  ): Promise<boolean>

  /**
   * Select query
   * @param query - SQL query
   * @returns {Promise<any>} - Query result
   */
  export function select(query: string): Promise<any>

  /**
   * Insert query
   * @param query - SQL query
   * @returns {Promise<any>} - Query result
   */
  export function insert(query: string): Promise<any>

  /**
   * Update query
   * @param query - SQL query
   * @returns {Promise<any>} - Query result
   */
  export function update(query: string): Promise<any>

  /**
   * Delete query
   * @param query - SQL query
   * @returns {Promise<any>} - Query result
   */
  export function deleteQuery(query: string): Promise<any>

  /**
   * Bulk insert query
   * @param query - SQL query
   * @returns {Promise<any>} - Query result
   */
  export function bulkInsert(query: string): Promise<any>
}
