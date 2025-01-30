import { CreateTableParams } from '../../../lib'

export type Accessories = {
  id: number
  accessory_name: string
  accessory_type: string
  sell_price: number
}

export const accessories: CreateTableParams<Accessories> = {
  name: 'accessories',
  columns: [
    { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
    { name: 'accessory_name', type: 'VARCHAR', length: 255 },
    { name: 'accessory_type', type: 'VARCHAR', length: 25 },
    { name: 'sell_price', type: 'DECIMAL' },
  ],
}
