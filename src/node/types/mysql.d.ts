/** nexium.node module type declarations */
declare module '*.node' {
  // ----------- MySQL Functions
  export function connectMySQL(host: string, user: string, password: string, database: string): boolean
  export function closeMySQL(): boolean
  export function createTable(table_name: string, column_definitions: string): boolean
}
