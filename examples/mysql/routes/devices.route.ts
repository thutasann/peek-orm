import { IncomingMessage, ServerResponse } from 'http'
import { DevicesController } from '../controllers/devices.controller'
const devicesController = new DevicesController()

/**
 * ### Devices Routes
 * - curl -X GET http://localhost:3000/api/devices
 * - curl -X PUT http://localhost:3000/api/devices/update
 * - curl -X PUT http://localhost:3000/api/devices/update-many
 * - curl -X GET http://localhost:3000/api/devices/id
 * - curl -X POST http://localhost:3000/api/devices/insert
 * - curl -X DELETE http://localhost:3000/api/devices/delete
 */
export const devicesRoutes = async (req: IncomingMessage, res: ServerResponse, path: string) => {
  if (path === '/api/devices' && req.method === 'GET') {
    return await devicesController.getAlldevices(res)
  } else if (path === '/api/devices/id' && req.method === 'GET') {
    return await devicesController.getDeviceById(res, 1)
  } else if (path === '/api/devices/insert' && req.method === 'POST') {
    return await devicesController.insertDevice(res)
  } else if (path === '/api/devices/update' && req.method === 'PUT') {
    return await devicesController.updateDevice(res)
  } else if (path === '/api/devices/update-many' && req.method === 'PUT') {
    return await devicesController.updateManyDevices(res)
  } else if (path === '/api/devices/delete' && req.method === 'DELETE') {
    return await devicesController.deleteDevice(res)
  } else {
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'Not Found' }))
  }
}
