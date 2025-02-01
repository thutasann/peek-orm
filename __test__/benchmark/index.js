// @ts-check
const { MySQL } = require('../../lib')
const { connectParams } = require('./configs/db')
const { device_benchmark_test } = require('./device.benchmark')
const { big_table_benchmark_test } = require('./big_table.benchmark')

;(async function main() {
  const db_status = await MySQL.client().connect(connectParams, './schemas')
  if (db_status.connected) {
    // await device_benchmark_test()
    await big_table_benchmark_test()
  } else {
    console.log('Failed to connect to database')
    throw new Error('Failed to connect to database')
  }
})()
