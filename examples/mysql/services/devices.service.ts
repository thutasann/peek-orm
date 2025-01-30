import { select } from '../../../lib'
import { Devices } from '../schemas/devices.peek'

export async function get_devices() {
  const data = await select<Devices>('devices', (qb) => qb.select('*'))
  return data
}

export async function get_device_by_id(id: number) {
  const data = await select<Devices>('devices', (qb) => qb.select('*').where({ id }))
  return data
}
