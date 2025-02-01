import { createServer, IncomingMessage, ServerResponse } from 'http'
import { parse } from 'url'
import { MySQL } from '../../lib'
import { COLORS } from './configs/colors'
import { connectParams } from './configs/db'
import { router } from './router'

const PORT = process.env.PORT || 3000

async function main() {
  try {
    const status = await MySQL.client().connect(connectParams, './schemas')

    if (!status.connected) {
      console.error('Failed to connect to MySQL')
      process.exit(1)
    }

    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

      if (req.method === 'OPTIONS') {
        res.writeHead(200)
        res.end()
        return
      }

      const parsedUrl = parse(req.url || '', true)
      const path = parsedUrl.pathname

      router(req, res, path)
    })

    server.listen(PORT, () => {
      console.log(`🚀 ${COLORS.greenBright}Server running at http://localhost:${PORT}/${COLORS.reset}`)
    })

    process.on('SIGINT', () => {
      console.log('SIGINT received, cleaning up MySQL connection')
      MySQL.client().cleanup()
      process.exit(0)
    })

    process.on('SIGTERM', () => {
      console.log('SIGTERM received, cleaning up MySQL connection')
      MySQL.client().cleanup()
      process.exit(0)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}
main()
