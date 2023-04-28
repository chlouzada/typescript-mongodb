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

describe("client testing", () => {
  test("type check ref key", async () => {
    client.ref("first.persons")
    client.ref("second.animals")
    // @ts-expect-error
    client.ref("x")
    // @ts-expect-error
    client.ref("first.x")
  })

  test("ref key", async () => {
    const dbName = "first"
    const collectionName = "persons"
    client.ref("first.persons")
    const collection = client.ref(`${dbName}.${collectionName}`)
    assert.equal(collection.collectionName, collectionName)
    assert.equal(collection.dbName, dbName)
  })

  test("dbRef key", async () => {
    const dbName = "first"
    const db = client.dbRef(dbName)
    assert.equal(db.databaseName, dbName)
  })

  test("collectionRef key", async () => {
    const collectionName = "persons"
    const db = client.dbRef("first")
    const collection = db.collectionRef(collectionName)
    assert.equal(collection.collectionName, collectionName)
  })
})
