import { ServerResponse } from 'http'
import { Devices } from '../schemas/devices.peek'
import { devicesService } from '../services/devices.service'

export class DevicesController {
  async getAlldevices(res: ServerResponse) {
    try {
      const devices = await devicesService.get_devices()
      res.writeHead(200)
      res.end(JSON.stringify(devices))
    } catch (error) {
      res.writeHead(500)
      res.end(JSON.stringify({ error: 'Internal Server Error', details: error }))
    }
  }

  async insertDevice(res: ServerResponse) {
    const payload: Partial<Devices> = {
      name: 'device 30',
      device_type: 'car',
      sell_price: 2000,
      city: 'london',
    }
    try {
      const response = await devicesService.insert_device(payload)
      res.writeHead(200)
      res.end(JSON.stringify(response))
    } catch (error) {
      res.writeHead(500)
      res.end(JSON.stringify({ error: 'Internal Server Error', details: error }))
    }
  }

  async getDeviceById(res: ServerResponse, id: number) {
    try {
      const device = await devicesService.get_device_by_id(id)
      res.writeHead(200)
      res.end(JSON.stringify(device))
    } catch (error) {
      res.writeHead(500)
      res.end(JSON.stringify({ error: 'Internal Server Error' }))
    }
  }

  async updateDevice(res: ServerResponse) {
    try {
      const response = await devicesService.update_device()
      res.writeHead(200)
      res.end(JSON.stringify(response))
    } catch (error) {
      res.writeHead(500)
      res.end(JSON.stringify({ error: 'Internal Server Error' }))
    }
  }

  async updateManyDevices(res: ServerResponse) {
    try {
      const response = await devicesService.update_multiple_devices()
      res.writeHead(200)
      res.end(JSON.stringify(response))
    } catch (error) {
      res.writeHead(500)
      res.end(JSON.stringify({ error: 'Internal Server Error' }))
    }
  }

  async deleteDevice(res: ServerResponse) {
    const response = await devicesService.delete_device()
    res.writeHead(200)
    res.end(JSON.stringify(response))
  }
}
