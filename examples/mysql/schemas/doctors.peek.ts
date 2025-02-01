import { CreateTableParams } from '../../../lib/types/mysql-types/table-columns/column-definition.type'

export type DoctorTable = {
  id: number
  name: string
  email: string
  phone: string
  is_active: boolean
  is_deleted: boolean
  city: string
}

export const doctors: CreateTableParams<DoctorTable> = {
  name: 'doctors',
  columns: [
    { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
    { name: 'name', type: 'VARCHAR', length: 255 },
    { name: 'email', type: 'VARCHAR', length: 255 },
    { name: 'phone', type: 'VARCHAR', length: 255 },
    { name: 'is_active', type: 'BOOLEAN', default: false },
    { name: 'is_deleted', type: 'BOOLEAN', default: false },
    { name: 'city', type: 'VARCHAR', length: 255 },
  ],
  indexes: [{ indexName: 'idx_name_email', columns: ['name', 'email'] }],
}
