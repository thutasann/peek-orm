// @ts-check
const { MySQL } = require('../lib')

/** @type {import('../lib').ConnectParams} */
const connectParams = {
  host: 'localhost',
  user: 'root',
  password: 'thutasann2002tts',
  database: 'mysql_crash',
}

MySQL.client()
  .connect(connectParams)
  .then((res) => {
    if (res.connected) {
      console.log('Connected to MySQL...')
    }
  })
