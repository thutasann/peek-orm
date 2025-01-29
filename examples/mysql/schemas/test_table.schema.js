// @ts-check

/**
 * Test table columns
 * @type {import('../../../lib').CreateTableParams}
 */
const test_table = {
  name: 'test_table',
  columns: [
    { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
    { name: 'name', type: 'VARCHAR', length: 255 },
    { name: 'email', type: 'VARCHAR', length: 255, unique: true },
    { name: 'address', type: 'VARCHAR', length: 255 },
  ],
}

module.exports = {
  test_table,
}
