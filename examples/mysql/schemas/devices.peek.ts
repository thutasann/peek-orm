import { CreateTableParams } from '../../../lib'

export type Devices = {
  id: number
  name: string
  device_type: string
}

export const devices: CreateTableParams<Devices> = {
  name: 'devices',
  columns: [
    { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
    { name: 'name', type: 'VARCHAR', length: 255 },
    { name: 'device_type', type: 'VARCHAR', length: 25 },
  ],
}
