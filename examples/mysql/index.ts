import { createServer, IncomingMessage, ServerResponse } from 'http'
import { parse } from 'url'
import { MySQL } from '../../lib'
import { connectParams } from './configs/db'
import { router } from './router'
const PORT = 3000

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

  MySQL.client()
    .connect(connectParams, './schemas')
    .then((status) => {
      if (status.connected) {
        router(req, res, path)
      } else {
        console.log('Failed to connect to MySQL')
      }
    })
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`)
})

process.on('SIGINT', () => {
  MySQL.client().cleanup()
  process.exit(0)
})
