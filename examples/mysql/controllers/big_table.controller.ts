import { ServerResponse } from 'http'
import { bigTableService } from '../services/big_table.service'

export class BigTableController {
  async insertBigTable(res: ServerResponse) {
    try {
      const payload = bigTableService.mock_big_table_data()
      const bigTable = await bigTableService.insert_big_table(payload)
      res.writeHead(200)
      res.end(JSON.stringify(bigTable))
    } catch (error) {
      res.writeHead(500)
      res.end(JSON.stringify({ error: 'Internal Server Error', details: error }))
    }
  }

  async getBigTable(res: ServerResponse) {
    const bigTable = await bigTableService.get_big_table()
    const response = {
      length: bigTable.length,
      data: bigTable,
    }
    res.writeHead(200)
    res.end(JSON.stringify(response))
  }
}
