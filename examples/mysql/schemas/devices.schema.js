// @ts-check

/**
 * Devices table columns
 * @type {import('../../../lib').CreateTableParams}
 */
const devices = {
  name: 'devices',
  columns: [
    { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
    { name: 'name', type: 'VARCHAR', length: 255 },
    { name: 'device_type', type: 'VARCHAR', length: 25 },
  ],
}

module.exports = {
  devices,
}
