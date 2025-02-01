import { IncomingMessage, ServerResponse } from 'http'

export const userRoutes = async (req: IncomingMessage, res: ServerResponse, path: string) => {
  if (path === '/api/users' && req.method === 'GET') {
    try {
      const users: any[] = []
      res.writeHead(200)
      res.end(JSON.stringify(users))
    } catch (error) {
      res.writeHead(500)
      res.end(JSON.stringify({ error: 'Internal Server Error' }))
    }
  } else {
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'Not Found' }))
  }
}
