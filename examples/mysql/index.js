// @ts-check
const { MySQL } = require('../../lib')
const { connectParams } = require('./configs/db')

async function main() {
  await MySQL.client().connect(connectParams, './schemas')
}

main()
