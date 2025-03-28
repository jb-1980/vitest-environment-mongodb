import type { Environment } from "vitest/environments"
import { MongoMemoryReplSet, MongoMemoryServer } from "mongodb-memory-server"

type Options =
  | {
      replicaSet?: false
      mongoUrlEnvName?: string
      serverOptions?: NonNullable<
        Parameters<(typeof MongoMemoryServer)["create"]>[0]
      >
    }
  | {
      replicaSet: true
      mongoUrlEnvName?: string
      serverOptions?: NonNullable<
        Parameters<(typeof MongoMemoryReplSet)["create"]>[0]
      >
    }

export default <Environment>{
  name: "mongodb",
  transformMode: "ssr",
  async setup(_, options?: Options) {
    // parse out options
    const isReplicaSet = options?.replicaSet
    const serverOptions = options?.serverOptions ?? {}
    const mongoUrlEnvName =
      options?.mongoUrlEnvName ?? "MONGO_CONNECTION_STRING"

    // create server
    const mongoServer = isReplicaSet
      ? await MongoMemoryServer.create(serverOptions)
      : await MongoMemoryReplSet.create(serverOptions)

    // put the connection string in the environment
    process.env[mongoUrlEnvName] = mongoServer.getUri()

    return {
      async teardown() {
        // stop the server
        await mongoServer.stop()
      },
    }
  },
}
