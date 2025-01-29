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
  await MySQL.client().connect(connectParams, './schemas')
}
```

## Schemas

create `schemas` folder in the root directory and create `*.peek.ts` files in the `schemas` folder.

```ts
import { CreateTableParams } from 'peek-orm'
const accessories: CreateTableParams = {
  name: 'accessories',
  columns: [
    { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
    { name: 'accessory_name', type: 'VARCHAR', length: 255 },
    { name: 'accessory_type', type: 'VARCHAR', length: 25 },
  ],
}
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
