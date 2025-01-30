import { CreateTableParams } from '../../../lib'

export type City = {
  id: number
  name: string
  country: string
}

export const city: CreateTableParams<City> = {
  name: 'city',
  columns: [
    { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
    { name: 'name', type: 'VARCHAR', length: 255 },
    { name: 'country', type: 'VARCHAR', length: 255 },
  ],
}
