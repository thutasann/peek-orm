// @ts-check
const { MySQL } = require('../../lib')
const { connectParams } = require('./configs/db')
const { select_benchmark_test } = require('./select.benchmark')

;(async function main() {
  const db_status = await MySQL.client().connect(connectParams, './schemas')
  if (db_status.connected) {
    await select_benchmark_test()
  } else {
    console.log('Failed to connect to database')
    throw new Error('Failed to connect to database')
  }
})()
