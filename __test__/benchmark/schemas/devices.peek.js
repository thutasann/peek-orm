import { CreateTableParams } from '../../../lib'

export const devices = {
  name: 'devices',
  columns: [
    { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
    { name: 'name', type: 'VARCHAR', length: 255 },
    { name: 'device_type', type: 'VARCHAR', length: 25 },
    { name: 'sell_price', type: 'DECIMAL' },
    { name: 'city', type: 'VARCHAR', length: 255 },
  ],
}
