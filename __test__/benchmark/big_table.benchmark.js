// @ts-check
const { get_big_table_service } = require('./services/big_table')
const { benchmark_args } = require('./utils')
const { updateResult } = require('./utils/update_readme')

const iterations = 1000

async function big_table_benchmark_test() {
  console.log('\nBig Table Benchmark Test ==> ')

  /** Prepare the results array for table @type { any } */
  const results = []

  const get_big_table = benchmark_args(get_big_table_service, [], iterations, true)
  results.push({
    Method: 'Get Big Table',
    Time: get_big_table.toFixed(6),
  })

  await updateResult(results, './results/big_table.md', 'Big Table Benchmark for 1000 rows with 1000 iterations')
}

module.exports = {
  big_table_benchmark_test,
}
