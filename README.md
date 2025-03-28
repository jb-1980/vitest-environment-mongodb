# vitest-environment-mongodb

Setup a MongoDB environment for Vitest tests using mongodb-memory-server.

This package provides a Vitest environment that uses `mongodb-memory-server` to create an in-memory MongoDB instance for testing purposes. It is designed to be used with Vitest, a Vite-native test framework.

It will spin up a memory server instance, and set the connection string on
`process.env.MONGO_CONNECTION_STRING` by default, or value you can configure
with `mongoUrlEnvName` option.

## Installation

Use your favorite package manager to install the package:

```bash
npm install --save-dev vitest-environment-mongodb
```

or

```bash
yarn add --dev vitest-environment-mongodb
```

or

```bash
pnpm add --save-dev vitest-environment-mongodb
```

## Usage

Once installed, you can use the environment in your Vitest configuration per the
[documentation](https://vitest.dev/guide/environment.html).

### Use in Vitest config

```js
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "mongodb",
    environmentOptions: {
      mongoUrlEnvName: "MONGO_CONNECTION_STRING", // optional, default is MONGO_CONNECTION_STRING
      replicaSet: false, // optional, default is false
      serverOptions: MongoMemoryServerOpts | MongoMemoryReplSetOpts, //optional, server options for the chosen server type
    },
  },
})
```

### Use control comment in a test file

```js
// @vitest-environment mongodb
import { expect, test } from "vitest"
import { UserCollection } from "./models/UserCollection"

test("should create a user", async () => {
  const { insertedId } = await UserCollection.insertOne({ name: "John Doe" })
  const user = await UserCollection.findOne({ _id: insertedId })
  expect(user).toBeDefined()
  expect(user).toHaveProperty("name")
  expect(user).toHaveProperty("_id")
  expect(user.name).toBe("John Doe")
})
```

## Options

- `mongoUrlEnvName` (string): The name of the environment variable that will contain the MongoDB connection string. Default is `MONGO_CONNECTION_STRING`.
- `replicaSet` (boolean): Whether to use a replica set. Default is `false`.
  And any other options that are supported by `mongodb-memory-server` package.
