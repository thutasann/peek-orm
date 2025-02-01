import { IncomingMessage, ServerResponse } from 'http'
import { devicesService } from '../services/devices.service'

export const devicesRoutes = async (req: IncomingMessage, res: ServerResponse, path: string) => {
  if (path === '/api/devices' && req.method === 'GET') {
    try {
      const devices = await devicesService.get_devices_native()
      res.writeHead(200)
      res.end(JSON.stringify(devices))
    } catch (error) {
      res.writeHead(500)
      res.end(JSON.stringify({ error: 'Internal Server Error' }))
    }
  } else {
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'Not Found' }))
  }
}
