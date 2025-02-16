// @ts-check
const { get_all_devices, get_all_devices_native_query } = require('./services/devices')
const { benchmark_args } = require('./utils')
const { updateResult } = require('./utils/update_readme')

const iterations = 10000

async function device_benchmark_test() {
  console.log('\nDevice Benchmark Test ==> ')

  /** Prepare the results array for table @type { any } */
  const results = []

  const select_all_devices = await benchmark_args(get_all_devices, [], iterations, true)
  results.push({
    Method: 'Get All Devices',
    Time: select_all_devices.toFixed(6),
  })
  results.push({})

  const select_all_devices_native_query = await benchmark_args(get_all_devices_native_query, [], iterations, true)
  results.push({
    Method: 'Select All Devices Native Query',
    Time: select_all_devices_native_query.toFixed(6),
  })
  results.push({})

  await updateResult(results, './results/devices.md', 'Devices Benchmark')
}

module.exports = {
  device_benchmark_test,
}
