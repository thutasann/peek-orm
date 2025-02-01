// @ts-check
const { peek } = require('../../../lib')

async function get_big_table_service() {
  const response = await peek.select('big_table', (qb) => qb.select('*'))
  return response
}

module.exports = {
  get_big_table_service,
}
