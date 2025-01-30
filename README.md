# **Peek ORM**

Peek ORM is a high-performance Node.js ORM (Object-Relational Mapping) package that leverages native C bindings for optimal speed and efficiency. It provides a seamless bridge between your Node.js application and relational databases, offering native-level performance while maintaining the ease of use of JavaScript.

---

## Features

- 🚀 **High Performance**: Powered by native C bindings for maximum speed and efficiency
- 🔄 **Type Safety**: Full TypeScript support with robust type checking
- 🛠️ **Simple API**: Intuitive and developer-friendly query interface
- 🎯 **Native Query Support**: Write raw SQL queries when needed
- 📦 **Lightweight**: Minimal overhead and dependencies
- 🔒 **Connection Pooling**: Efficient database connection management
- 🎨 **Schema Management**: Easy-to-use schema definition and migration tools
- 🔍 **Query Builder**: Fluent interface for building complex queries
- ⚡ **Eager Loading**: Optimize related data loading for better performance

---

## MySQL Connect

Define the connection parameters and pass them to the `connect` method.

```ts
import { MySQL } from 'peek-orm'

const connectParams: ConnectParams = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test',
}

async function main() {
  const mysql = await MySQL.client().connect(connectParams, './schemas')
  if (mysql.connected) {
    console.log('Connected to MySQL')
  } else {
    console.log('Failed to connect to MySQL')
  }
}
```

## Schemas

create `schemas` folder in the root directory and create `*.peek.ts` files in the `schemas` folder.

```ts
import { CreateTableParams } from 'peek-orm'

export type Devices = {
  id: number
  name: string
  device_type: string
}

export const devices: CreateTableParams<Devices> = {
  name: 'devices',
  columns: [
    { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
    { name: 'name', type: 'VARCHAR', length: 255 },
    { name: 'device_type', type: 'VARCHAR', length: 25 },
  ],
}
```

## Basic Query

```ts
import { peek } from 'peek-orm'

async function get_devices() {
  const data = await peek.select<Devices>('devices', (qb) => qb.select('*').where({ name: 'device 1' }))
  return data
}

const devices = await get_devices() // [ { name: 'device 1', device_type: 'laptop' } ]
```

### Queries Samples

```ts
// select name and device_type where name is 'device 1' or device_type is 'laptop'
const query_1 = await peek.select<Devices>('devices', (qb) =>
  qb.select(['name', 'device_type']).where({ name: 'device 1' }).orWhere({ device_type: 'laptop' }),
)

// select name and device_type where name is 'device 1' and device_type is 'laptop'
const query_2 = await peek.select<Devices>('devices', (qb) =>
  qb.select(['name', 'device_type']).where({ name: 'device 1' }).andWhere({ device_type: 'laptop', name: 'device 2' }),
)

// select all columns where offset is 1 and limit is 2
const query_3 = await peek.select<Devices>('devices', (qb) => qb.select('*').offset(1).limit(2))

// select all columns where id is greater than 1 and name is 'device 2'
const query_4 = await peek.select<Devices>('devices', (qb) =>
  qb.select('*').where('id > 1').where({ name: 'device 2' }),
)
```

---

## ✅ Scripts

**Clone the repo**

```bash
git clone https://github.com/thutasann/peek-orm.git
```

**Install Packages**

```bash
yarn
```

**Compile and build the lib**

```bash
yarn build
```

**Test**

```bash
yarn test
```

**Examples Codes**

```bash
yarn example
```

## 🤝 Contributing

We welcome contributions! If you have suggestions or improvements, please fork the repository and submit a pull request.

## 🔥 Stay Ahead with Peek ORM

Secure your Node.js applications with high-performance, native C security utilities and experience the power of Peek ORM!

## Authors

- [Thuta Sann](https://github.com/thutasann)
