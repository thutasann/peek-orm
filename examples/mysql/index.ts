import { MySQL, select } from '../../lib'
import { connectParams } from './configs/db'

function get_customers() {
  return select('customers', (qb) => qb.select(['customer_id', 'first_name', 'email']))
}

async function main() {
  const mysql = await MySQL.client().connect(connectParams, './schemas')
  if (mysql.connected) {
    const customers = await get_customers()
    console.log('customers', customers)
  } else {
    console.log('Failed to connect to MySQL')
  }
}

main()
