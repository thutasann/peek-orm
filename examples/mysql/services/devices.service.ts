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

export async function get_devices_native(): Promise<Devices[]> {
  const data = await peek.select<Devices>('devices', (qb) => qb.native(`SELECT * FROM devices`))
  return data
}

export async function insert_device(): Promise<void> {
  const response = await peek.insert<Devices>('devices', {
    name: 'device 17',
    device_type: 'car',
    sell_price: 2000,
  })
  console.log('response ==> ', response)
}

export async function insert_multiple_devices(): Promise<void> {
  const response = await peek.insert<Devices>('devices', [
    { name: 'device 25', device_type: 'car', sell_price: 4000 },
    { name: 'device 29', device_type: 'bike', sell_price: 5000 },
  ])
  console.log('response ==> ', response)
}
