import { add } from '../../build/Release/peek-orm.node'

/**
 * Maths Functions
 */
export class Maths {
  /** Add two numbers */
  static add(a: number, b: number): number {
    return add(a, b)
  }
}
