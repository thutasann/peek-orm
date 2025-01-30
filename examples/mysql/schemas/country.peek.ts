import { CreateTableParams } from '../../../lib'

export type Country = {
  id: number
  name: string
  population: number
  president: string
}

export const country: CreateTableParams<Country> = {
  name: 'country',
  columns: [
    { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
    { name: 'name', type: 'VARCHAR', length: 255 },
    { name: 'population', type: 'INT' },
    { name: 'president', type: 'VARCHAR', length: 255 },
  ],
}
