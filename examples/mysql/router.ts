import { IncomingMessage, ServerResponse } from 'http'
import { devicesRoutes } from './routes/devices.route'
import { welcomeRoute } from './routes/welcome.route'

export const router = (req: IncomingMessage, res: ServerResponse, path: string | null) => {
  res.setHeader('Content-Type', 'application/json')

  if (path === '/') {
    welcomeRoute(req, res)
  } else if (path?.startsWith('/api/devices')) {
    devicesRoutes(req, res, path)
  } else {
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'Not Found' }))
  }
}
