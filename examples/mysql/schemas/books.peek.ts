import { CreateTableParams } from '../../../lib'
import { Authors } from './authors.peek'

export type Books = {
  id: number
  title: string
  author_id: Authors
}

export const books: CreateTableParams<Books> = {
  name: 'books',
  columns: [
    { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
    { name: 'title', type: 'VARCHAR', length: 255 },
    { name: 'author_id', type: 'INT', reference: { table: 'authors', column: 'id' } },
  ],
}
