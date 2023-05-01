import { test, assert, describe } from "vitest"

import { client } from "./setup"

describe("client testing", () => {
  test("ref key", async () => {
    const dbName = "first"
    const collectionName = "persons"
    client.ref("first.persons")
    const collection = client.ref(`${dbName}.${collectionName}`)
    assert.equal(collection.collectionName, collectionName)
    assert.equal(collection.dbName, dbName)
  })

  // test("dbRef key", async () => {
  //   const dbName = "first"
  //   const db = client.dbRef(dbName)
  //   assert.equal(db.databaseName, dbName)
  // })

  // test("collectionRef key", async () => {
  //   const collectionName = "persons"
  //   const db = client.dbRef("first")
  //   const collection = db.collectionRef(collectionName)
  //   assert.equal(collection.collectionName, collectionName)
  // })

  test("type inference", async () => {
    return
    client.ref("first.persons")
    client.ref("second.animals")
    // @ts-expect-error
    client.ref("x")
    // @ts-expect-error
    client.ref("first.x")
    // @ts-expect-error
    client.dbRef("x")
    // @ts-expect-error
    client.dbRef("first").collectionRef("x")
  })
})
