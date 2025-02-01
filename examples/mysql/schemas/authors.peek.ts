import { CreateTableParams } from '../../../lib'

export type Authors = {
  id: number
  name: string
  city: string
}

export const authors: CreateTableParams<Authors> = {
  name: 'authors',
  columns: [
    { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
    { name: 'name', type: 'VARCHAR', length: 255 },
    { name: 'city', type: 'VARCHAR', length: 255 },
  ],
}
