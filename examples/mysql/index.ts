import { MySQL, select } from '../../lib'
import { connectParams } from './configs/db'
import { Devices } from './schemas/devices.peek'

async function get_devices() {
  const data = await select<Devices>('devices', (qb) => qb.select(['name', 'device_type']).where({ name: 'device 1' }))
  return data
}

async function main() {
  const mysql = await MySQL.client().connect(connectParams, './schemas')
  if (mysql.connected) {
    const devices = await get_devices()
    console.log('devices', devices)
  } else {
    console.log('Failed to connect to MySQL')
  }
}

main()
