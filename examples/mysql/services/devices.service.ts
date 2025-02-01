import { peek } from '../../../lib'
import { Devices } from '../schemas/devices.peek'

async function get_devices(): Promise<Devices[]> {
  const data = await peek.select<Devices>('devices', (qb) => qb.select('*').where('id > 1').where({ name: 'device 2' }))
  return data
}

async function get_device_by_id(id: number): Promise<Devices> {
  const data = await peek.selectOne<Devices>('devices', (qb) => qb.select('*').where({ id }))
  return data
}

async function get_devices_native(): Promise<Devices[]> {
  const data = await peek.select<Devices>('devices', (qb) => qb.native(`SELECT * FROM devices`))
  return data
}

async function insert_device(payload: Partial<Devices>) {
  const response = await peek.insert<Devices>('devices', payload)
  return response
}

async function insert_multiple_devices() {
  const response = await peek.insert<Devices>('devices', [
    { name: 'device 25', device_type: 'car', sell_price: 4000 },
    { name: 'device 29', device_type: 'bike', sell_price: 5000 },
  ])
  console.log('response ==> ', response)
  return response
}

async function update_device() {
  const response = await peek.updateOne<Devices>(
    'devices',
    { id: 1 },
    { name: 'device 1 updated', device_type: 'bike', sell_price: 1000 },
  )
  return response
}

async function update_multiple_devices() {
  const response = await peek.updateMany<Devices>('devices', { device_type: 'car updated' }, [
    { device_type: 'car', sell_price: 1000 },
  ])
  return response
}

async function update_multiple_devices_with_null() {
  const response = await peek.updateMany<Devices>('devices', { city: 'NULL' }, [{ city: 'london' }])
  return response
}

export const devicesService = {
  get_devices,
  get_device_by_id,
  get_devices_native,
  insert_device,
  insert_multiple_devices,
  update_device,
  update_multiple_devices,
  update_multiple_devices_with_null,
}
