// @ts-check

/**
 * Accessories Schema
 * @type {import('../../../lib').CreateTableParams}
 */
const accessories = {
  name: 'accessories',
  columns: [
    { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
    { name: 'accessory_name', type: 'VARCHAR', length: 255 },
    { name: 'accessory_type', type: 'VARCHAR', length: 25 },
    { name: 'sell_price', type: 'DECIMAL' },
  ],
}

module.exports = {
  accessories,
}
