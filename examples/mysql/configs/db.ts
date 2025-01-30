import { ConnectParams } from '../../../lib'
// @ts-ignore
import config from '../config.json'

export const connectParams: ConnectParams = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  port: config.mysql.port || 3306,
}
