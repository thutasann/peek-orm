import { IncomingMessage, ServerResponse } from 'http'
import { BigTableController } from '../controllers/big_table.controller'
const bigTableController = new BigTableController()

/**
 * ### BigTable Routes
 * - This table is used to test the performance of the database
 * - curl -X POST http://localhost:3000/api/big_table/create
 * - curl -X GET http://localhost:3000/api/big_table/get
 */
export const bigTableRoutes = async (req: IncomingMessage, res: ServerResponse, path: string) => {
  if (path === '/api/big_table/create' && req.method === 'POST') {
    return await bigTableController.insertBigTable(res)
  } else if (path === '/api/big_table/get' && req.method === 'GET') {
    return await bigTableController.getBigTable(res)
  } else {
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'Not Found' }))
  }
}
