import {
  test,
  assert,
  beforeEach,
  afterEach,
  describe,
  beforeAll,
  afterAll,
} from "vitest"
import { Client } from "../src"
import { z } from "zod"

const options = {
  uri: "mongodb://localhost:27017/first",
  db: {
    first: {
      persons: z.object({ title: z.string() }),
    },
    second: {
      animals: z.any(),
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

describe("client testing", () => {
  test("typed ref key", async () => {
    const dbName = "first"
    const collectionName = "persons"

    const collection = client.ref(`${dbName}.${collectionName}`)

    assert.equal(collection.collectionName, collectionName)
    assert.equal(collection.dbName, dbName)
  })
})
