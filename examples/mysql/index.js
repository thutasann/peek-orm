// @ts-check
const { MySQL, select } = require('../../lib')
const { connectParams } = require('./configs/db')

async function main() {
  const mysql = await MySQL.client().connect(connectParams, './schemas')
  if (mysql.connected) {
    const customers = await select('customers', (qb) =>
      qb.select(['customer_id', 'first_name', 'last_name']).where({ first_name: 'Fred' }),
    )
    console.log('customers', customers)
  } else {
    console.log('Failed to connect to MySQL')
  }
}

main()
