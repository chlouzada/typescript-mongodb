import { beforeEach, afterEach, beforeAll, afterAll } from "vitest"
import { Client } from "../src"

const typedClient = new Client<{
  first: ["persons"]
  second: ["animals"]
}>({
  uri: "mongodb://localhost:27017/first",
})

const notTypedClient = new Client({
  uri: "mongodb://localhost:27017/test",
})

const clearDb = async () => {
  await typedClient.db("first").dropDatabase()
  await typedClient.db("second").dropDatabase()
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
