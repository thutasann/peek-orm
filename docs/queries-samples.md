# Queries Samples

In this section, we will show you how to use </br>
the `peek.select`, `peek.insert`, `peek.update`, and `peek.delete` methods.

## Create Index

```ts
const tableName = 'your_table_name'
const indexName = 'your_index_name'
const columns = 'column1, column2' // Specify the columns for the index

mysqlModule
  .createIndex(tableName, indexName, columns)
  .then((result) => {
    console.log('Index created successfully:', result)
  })
  .catch((err) => {
    console.error('Error creating index:', err)
  })
```

## Select Queries

```ts
const query_1 = await peek.select<Devices>('devices', (qb) =>
  qb.select(['name', 'device_type']).where({ name: 'device 1' }).orWhere({ device_type: 'laptop' }),
)

const query_2 = await peek.select<Devices>('devices', (qb) =>
  qb.select(['name', 'device_type']).where({ name: 'device 1' }).andWhere({ device_type: 'laptop', name: 'device 2' }),
)

const query_3 = await peek.select<Devices>('devices', (qb) => qb.select('*').offset(1).limit(2))

const query_4 = await peek.select<Devices>('devices', (qb) =>
  qb.select('*').where('id > 1').where({ name: 'device 2' }),
)

const query_5 = await peek.select<Devices>('devices', (qb) => qb.native(`SELECT * FROM devices`))
```

## Insert Queries

```ts
// Insert a single record
const response_1 = await peek.insert<Devices>('devices', {
  name: 'device 9',
  device_type: 'car',
})

// Insert multiple records
const response_2 = await peek.insert<Devices>('devices', [
  {
    name: 'device 9',
    device_type: 'car',
  },
  {
    name: 'device 10',
    device_type: 'car',
  },
])

console.log('response_1 ==> ', response_1) // { result: { affectedRows: 1, insertId: 10 }, values: ... }
console.log('response_2 ==> ', response_2) // { result: { affectedRows: 2, insertId: 10 }, values: ... }
```

## Update Queries

```ts
// Update a single record
const response_1 = await peek.updateOne<Devices>('devices', { id: 1 }, { name: 'device 1 updated' })

// Update multiple records
const response_2 = await peek.updateMany<Devices>('devices', { device_type: 'laptop' }, [
  { name: 'device 1 updated', sell_price: 1000 },
])
```
