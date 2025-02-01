import { CreateTableParams } from '../../../lib'

export type Apartments = {
  id: number
  name: string
  description: string
  is_active: boolean
  is_deleted: boolean
}

export const apartments: CreateTableParams<Apartments> = {
  name: 'apartments',
  columns: [
    { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
    { name: 'name', type: 'VARCHAR', length: 255 },
    { name: 'description', type: 'TEXT' },
    { name: 'is_active', type: 'BOOLEAN', default: false },
    { name: 'is_deleted', type: 'BOOLEAN', default: false },
  ],
  indexes: [{ indexName: 'idx_name_is_active', columns: ['name', 'is_active'] }],
}
