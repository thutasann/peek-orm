import { CreateTableParams } from '../../../lib'

export type Country = {
  id: number
  name: string
}

export const country: CreateTableParams<Country> = {
  name: 'country',
  columns: [
    { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
    { name: 'name', type: 'VARCHAR', length: 255 },
  ],
}
