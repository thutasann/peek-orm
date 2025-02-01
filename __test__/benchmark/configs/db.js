// @ts-check
const config = require('../config.json')

module.exports = {
  connectParams: {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    port: config.mysql.port || 3306,
  },
}
