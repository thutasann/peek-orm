import { IncomingMessage, ServerResponse } from 'http'
import { userRoutes } from './routes/user.routes'
import { welcomeRoute } from './routes/welcome.route'

export const router = (req: IncomingMessage, res: ServerResponse, path: string | null) => {
  res.setHeader('Content-Type', 'application/json')

  if (path === '/') {
    welcomeRoute(req, res)
  } else if (path?.startsWith('/api/users')) {
    userRoutes(req, res, path)
  } else {
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'Not Found' }))
  }
}
