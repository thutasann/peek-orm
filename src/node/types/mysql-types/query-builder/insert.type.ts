/**
 * Results of an insert query coming from C function
 */
export type InsertedResult = {
  /**
   * Number of affected rows
   */
  affectedRows: number
  /**
   * Inserted ID
   */
  insertId: number
}
