import { beforeEach, afterEach, beforeAll, afterAll } from "vitest"
import { Client } from "../src"

type Config = {
  test: ["one", "two"]
}

const typedClient = new Client<Config>({
  uri: "mongodb://localhost:27017",
})

const notTypedClient = new Client({
  uri: "mongodb://localhost:27017",
})

const clearDb = async () => {
  const dbName: keyof Config = "test"
  await typedClient.db(dbName).dropDatabase()
}

beforeAll(async () => {
  await typedClient.connect()
})

beforeEach(async () => {
  await clearDb()
})

afterEach(async () => {
  await clearDb()
})

afterAll(async () => {
  await typedClient.close()
})

export { typedClient, notTypedClient }
