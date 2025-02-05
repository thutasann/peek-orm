import { peek } from '../../../lib'
import { BigTable } from '../schemas/big_table.peek'

function mock_big_table_data(count: number = 15): Omit<BigTable, 'id'>[] {
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Home', 'Sports']
  const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Sydney']
  const countries = ['USA', 'UK', 'Japan', 'France', 'Germany', 'Australia']

  return Array.from({ length: count }, () => ({
    name: `Product ${Math.random().toString(36).substring(7)}`,
    description: `Description for ${Math.random().toString(36).substring(7)}`,
    is_active: Math.random() > 0.2,
    is_deleted: Math.random() > 0.9,
    price: Number((Math.random() * 1000).toFixed(2)),
    quantity: Math.floor(Math.random() * 1000),
    category: categories[Math.floor(Math.random() * categories.length)],
    city: cities[Math.floor(Math.random() * cities.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
  }))
}

async function insert_big_table(payload: Partial<BigTable>[]) {
  const response = await peek.insert<BigTable>('big_table', payload)
  return response
}

async function get_big_table() {
  const response = await peek.select<BigTable>('big_table', (qb) => qb.select('*'))
  return response
}

async function bulk_insert_big_table(payload: Partial<BigTable>[]) {
  const response = await peek.bulkInsert<BigTable>('big_table', payload)
  return response
}

export const bigTableService = {
  insert_big_table,
  mock_big_table_data,
  get_big_table,
  bulk_insert_big_table,
}
