import { select as selectQuery } from '../../build/Release/peek-orm.node'
import { SelectQueryBuilder } from '../types'
import { createQueryBuilder } from './query-builder'

/**
 * Execute a SELECT query on a table
 * @template T - Type of the entity being queried
 * @param table - Name of the table to query
 * @param callback - Function to build the query
 * @returns {Promise<T[]>} Array of query results
 * @example
 * const users = await select<User>('users', (qb) =>
 *   qb.select(['id', 'name'])
 *     .where({ active: true })
 *     .limit(10)
 * );
 */
export async function select<T>(
  table: string,
  callback: (queryBuilder: SelectQueryBuilder<T>) => SelectQueryBuilder<T>,
): Promise<T[]> {
  const queryBuilder = createQueryBuilder<T>()
  const query = callback(queryBuilder)
  const finalQuery = query.getQuery()
  console.log('finalQuery', finalQuery)
  return selectQuery(table, finalQuery) as unknown as T[]
}
