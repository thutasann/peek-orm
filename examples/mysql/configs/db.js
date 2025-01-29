const config = require('../config.json')

/**
 * Connect params
 * @type {import('../../../lib').ConnectParams}
 */
const connectParams = {
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
}

module.exports = {
  connectParams,
}
