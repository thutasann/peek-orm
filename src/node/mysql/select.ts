import { select as selectQuery } from '../../build/Release/peek-orm.node'
import { SelectQueryBuilder } from '../types'
import { createQueryBuilder } from './query-builder'

/**
 * Execute a SELECT query on a table
 * @param table - Name of the table to query
 * @param callback - Function to build the query
 * @returns {Promise<T[]>} Array of query results
 */
export async function select<T extends Record<string, any>>(
  table: string,
  callback: (queryBuilder: SelectQueryBuilder<T>) => SelectQueryBuilder<T>,
): Promise<T[]> {
  const queryBuilder = createQueryBuilder<T>()
  queryBuilder.from(table)
  const query = callback(queryBuilder)
  const finalQuery = query.getQuery()
  return selectQuery(finalQuery) as unknown as T[]
}
