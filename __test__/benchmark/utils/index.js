// @ts-check

/** benchmark util */
function benchmark(fn, iterations = 100000) {
  const start = performance.now()
  for (let i = 0; i < iterations; i++) {
    fn()
  }
  const end = performance.now()
  return (end - start) / iterations
}

/**
 * Benchmarks a function by executing it multiple times and calculating the average execution time.
 * @param {Function} fn - The function to benchmark.
 * @param {Array<any>} args - The arguments to pass to the function.
 * @param {number} [runs=1000] - The number of times to execute the function for the benchmark.
 * @returns {number} - The average execution time in milliseconds.
 */
function benchmark_args(fn, args, runs = 1000, logResult = false) {
  // Warm-up runs to stabilize any JIT effects
  for (let i = 0; i < Math.min(10, runs); i++) {
    try {
      fn(...args)
    } catch (error) {
      console.error('Error during warm-up:', error)
      throw error
    }
  }

  const durations = []

  // Collect all measurements
  for (let i = 0; i < runs; i++) {
    const start = process.hrtime.bigint()
    try {
      fn(...args)
    } catch (error) {
      console.error('Error during benchmarking:', error)
      throw error
    }
    const end = process.hrtime.bigint()
    durations.push(Number(end - start) / 1e6) // Convert to milliseconds
  }

  // Calculate statistics
  durations.sort((a, b) => a - b)
  const min = durations[0]
  const max = durations[durations.length - 1]
  const median = durations[Math.floor(durations.length / 2)]
  const average = durations.reduce((a, b) => a + b) / durations.length

  if (logResult) {
    console.log(`Benchmark results for ${fn.name || 'anonymous'} over ${runs} runs:
    Average: ${average.toFixed(4)} ms
    Median:  ${median.toFixed(4)} ms
    Min:     ${min.toFixed(4)} ms
    Max:     ${max.toFixed(4)} ms`)
  }

  return average
}

module.exports = {
  benchmark,
  benchmark_args,
}
