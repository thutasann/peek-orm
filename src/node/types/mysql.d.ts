/** nexium.node module type declarations */
declare module '*.node' {
  // ----------- MySQL Functions
  export async function connectMySQL(host: string, user: string, password: string, database: string): Promise<boolean>
  export function closeMySQL(): boolean
  export function createTable(table_name: string, column_definitions: string): boolean
  export function select(table: string, condition: string): Promise<any>
}
