// @ts-check
const { peek } = require('../../../lib')

async function get_all_devices_native_query() {
  const data = await peek.select('devices', (qb) => qb.select('*'))
  return data
}

async function get_all_devices() {
  const data = await peek.select('devices', (qb) => qb.select('*'))
  return data
}

module.exports = {
  get_all_devices_native_query,
  get_all_devices,
}
