import { beforeEach, afterEach, beforeAll, afterAll } from "vitest"
import { Client } from "../src"

const options = {
  uri: "mongodb://localhost:27017/first",
  db: {
    first: {
      persons: true,
    },
    second: {
      animals: true,
    },
  },
}

const client = new Client(options)

const clearDb = async () => {
  for (const db in options.db) {
    const dbName = db as keyof typeof options.db
    await client.db(dbName).dropDatabase()
  }
}

beforeAll(async () => {
  await client.connect()
})

beforeEach(async () => {
  await clearDb()
})

afterEach(async () => {
  await clearDb()
})

afterAll(async () => {
  await client.close()
})

export { client }
