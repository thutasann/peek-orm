import { select, selectOne } from '../../../lib'
import { Devices } from '../schemas/devices.peek'

/**
 * Get all devices
 * @returns {Promise<Devices[]>} Array of devices
 */
export async function get_devices(): Promise<Devices[]> {
  const data = await select<Devices>('devices', (qb) => qb.select('*').where('id > 1').where({ name: 'device 2' }))
  return data
}

/**
 * Get device by id
 * @param id - Device id
 * @returns {Promise<Devices>} Device
 */
export async function get_device_by_id(id: number): Promise<Devices> {
  const data = await selectOne<Devices>('devices', (qb) => qb.select('*').where({ id }))
  return data
}
