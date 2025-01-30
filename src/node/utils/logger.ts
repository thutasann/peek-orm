const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
} as const

/**
 * Logger Utility
 * @description This is the logger utility class
 * @version 0.0.1
 * @author [thutasann](https://github.com/thutasann)
 */
export const logger = {
  /**
   * Log an info message
   * @param message - The message to log
   * @param details - Optional details to log
   */
  info: (message: string, details?: any) => {
    console.log(`${COLORS.blue}[INFO]:${COLORS.reset} ${message}`)
    if (details) console.log(`${COLORS.gray}${JSON.stringify(details, null, 2)}${COLORS.reset}`)
  },

  /**
   * Log a success message
   * @param message - The message to log
   * @param details - Optional details to log
   */
  success: (message: string, details?: any) => {
    console.log(`${COLORS.green}[SUCCESS]:${COLORS.reset} ${message}`)
    if (details) console.log(`${COLORS.gray}${JSON.stringify(details, null, 2)}${COLORS.reset}`)
  },

  /**
   * Log a warning message
   * @param message - The message to log
   * @param details - Optional details to log
   */
  warning: (message: string, details?: any) => {
    console.log(`${COLORS.yellow}[WARNING]:${COLORS.reset} ${message}`)
    if (details) console.log(`${COLORS.gray}${JSON.stringify(details, null, 2)}${COLORS.reset}`)
  },

  /**
   * Log an error message
   * @param message - The message to log
   * @param details - Optional details to log
   */
  error: (message: string, details?: any) => {
    console.log(`${COLORS.red}[ERROR]:${COLORS.reset} ${message}`)
    if (details) console.log(`${COLORS.gray}${JSON.stringify(details, null, 2)}${COLORS.reset}`)
  },
}
