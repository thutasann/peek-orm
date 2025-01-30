# Queries Samples

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
```
