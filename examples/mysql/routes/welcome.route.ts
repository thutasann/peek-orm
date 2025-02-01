import { IncomingMessage, ServerResponse } from 'http'

export const welcomeRoute = (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader('Content-Type', 'application/json')
  res.writeHead(200)
  res.end(JSON.stringify({ message: 'Welcome to the Peek ORM' }))
}
