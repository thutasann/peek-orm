# Queries Samples

In this section, we will show you how to use </br>
the `peek.select`, `peek.insert`, `peek.update`, and `peek.delete` methods.

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
