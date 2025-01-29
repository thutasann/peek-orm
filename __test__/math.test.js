// @ts-check
const { Maths } = require('../lib')

describe('mathFunctions', () => {
  it('should add two positive numbers correctly', () => {
    expect(Maths.add(1, 2)).toBe(3)
  })
})

const result = Maths.add(1, 2)
console.log(result)
