import { MySQL } from '../../lib'
import { connectParams } from './configs/db'
import { get_device_by_id, get_devices } from './services/devices.service'

async function main() {
  MySQL.client()
    .connect(connectParams, './schemas')
    .then(async (status) => {
      if (status.connected) {
        /** get all devices */
        const all_devices = await get_devices()
        console.log('all_devices', all_devices)

        /** get device by id */
        const device_by_id = await get_device_by_id(1)
        console.log('device_by_id', device_by_id)
      } else {
        console.log('Failed to connect to MySQL')
      }
    })
}

main()
