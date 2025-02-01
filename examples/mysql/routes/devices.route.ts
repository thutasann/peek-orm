import { IncomingMessage, ServerResponse } from 'http'
import { DevicesController } from '../controllers/devices.controller'
const devicesController = new DevicesController()

/**
 * ### Devices Routes
 * pls ignore the route methods, they are just for testing
 * - curl http://localhost:3000/api/devices
 * - curl http://localhost:3000/api/devices/update
 * - curl http://localhost:3000/api/devices/update-many
 * - curl http://localhost:3000/api/devices/id
 * - curl -X POST http://localhost:3000/api/devices/insert
 */
export const devicesRoutes = async (req: IncomingMessage, res: ServerResponse, path: string) => {
  if (path === '/api/devices' && req.method === 'GET') {
    return await devicesController.getAlldevices(res)
  } else if (path === '/api/devices/id' && req.method === 'GET') {
    return await devicesController.getDeviceById(res, 1)
  } else if (path === '/api/devices/insert' && req.method === 'GET') {
    return await devicesController.insertDevice(res)
  } else if (path === '/api/devices/update' && req.method === 'GET') {
    return await devicesController.updateDevice(res)
  } else if (path === '/api/devices/update-many' && req.method === 'GET') {
    return await devicesController.updateManyDevices(res)
  } else {
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'Not Found' }))
  }
}
