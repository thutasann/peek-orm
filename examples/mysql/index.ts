import { MySQL } from '../../lib'
import { connectParams } from './configs/db'
import { insert_device } from './services/devices.service'

async function main() {
  MySQL.client()
    .connect(connectParams, './schemas')
    .then(async (status) => {
      if (status.connected) {
        // const all_devices = await get_devices()
        // console.log('all_devices ==> ', all_devices)
        // const device_by_id = await get_device_by_id(1)
        // console.log('device_by_id ==>', device_by_id)
        // const all_devices_native = await get_device_by_id_native()
        // console.log('all_devices_native ==> ', all_devices_native)

        await insert_device()
      } else {
        console.log('Failed to connect to MySQL')
      }
    })
}

main()

process.on('SIGINT', () => {
  MySQL.client().cleanup()
  process.exit(0)
})
