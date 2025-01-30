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
  port: 3306,
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

### Queries Samples

- [Select Queries](./docs/queries-samples.md#select-queries)
- [Insert Queries](./docs/queries-samples.md#insert-queries)

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
