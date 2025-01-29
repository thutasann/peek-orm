// @ts-check
const { MySQL } = require('../../lib')
const { connectParams } = require('./configs/db')
const { devices } = require('./schemas/devices.schema')
const { test_table } = require('./schemas/test_table.schema')

async function main() {
  MySQL.client()
    .connect(connectParams)
    .then(async (res) => {
      if (res.connected) {
        console.log('Connected to MySQL... ✅')

        const test_table_res = await MySQL.client().createTable(test_table)
        console.log(`${test_table.name} created successfully ✅`, test_table_res)

        const devices_table_res = await MySQL.client().createTable(devices)
        console.log(`${devices.name} created successfully ✅`, devices_table_res)
      }
    })
}

main()
