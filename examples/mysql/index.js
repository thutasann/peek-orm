// @ts-check
const { MySQL } = require('../../lib')
const { connectParams } = require('./configs/db')
const { test_table } = require('./schemas/test_table.schema')

async function main() {
  MySQL.client()
    .connect(connectParams)
    .then(async (res) => {
      if (res.connected) {
        console.log('Connected to MySQL... ✅')

        const res = await MySQL.client().createTable(test_table)
        console.log(`${test_table.name} created successfully ✅`, res)
      }
    })
}

main()
