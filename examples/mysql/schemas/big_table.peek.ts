import { CreateTableParams } from '../../../lib'

export type BigTable = {
  id: number
  name: string
  description: string
  is_active: boolean
  is_deleted: boolean
  price: number
  quantity: number
  category: string
  city: string
  country: string
}

export const big_table: CreateTableParams<BigTable> = {
  name: 'big_table',
  columns: [
    { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
    { name: 'name', type: 'VARCHAR', length: 255 },
    { name: 'description', type: 'TEXT' },
    { name: 'is_active', type: 'BOOLEAN', default: false },
    { name: 'is_deleted', type: 'BOOLEAN', default: false },
    { name: 'price', type: 'FLOAT', default: 0 },
    { name: 'quantity', type: 'INT', default: 0 },
    { name: 'category', type: 'VARCHAR', length: 255 },
    { name: 'city', type: 'VARCHAR', length: 255 },
    { name: 'country', type: 'VARCHAR', length: 255 },
  ],
}
