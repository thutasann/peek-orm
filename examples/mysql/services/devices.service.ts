import { peek } from '../../../lib'
import { Devices } from '../schemas/devices.peek'

export async function get_devices(): Promise<Devices[]> {
  const data = await peek.select<Devices>('devices', (qb) => qb.select('*').where('id > 1').where({ name: 'device 2' }))
  return data
}

export async function get_device_by_id(id: number): Promise<Devices> {
  const data = await peek.selectOne<Devices>('devices', (qb) => qb.select('*').where({ id }))
  return data
}

export async function get_device_by_id_native(): Promise<Devices[]> {
  const data = await peek.select<Devices>('devices', (qb) => qb.native(`SELECT * FROM devices`))
  return data
}

export async function insert_device(): Promise<void> {
  await peek.insert('devices', {
    columns: ['name', 'device_type'],
    values: [{ name: 'device 4', device_type: 'car' }],
  })
}
