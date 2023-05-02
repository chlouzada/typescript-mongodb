import { test, assert, describe, expectTypeOf } from "vitest"

import { notTypedClient, typedClient } from "./setup"

describe("client testing", () => {
  test("ref key", async () => {
    const dbName = "test"
    const collectionName = "one"
    typedClient.ref("test.one")
    const collection = typedClient.ref(`${dbName}.${collectionName}`)
    assert.equal(collection.collectionName, collectionName)
    assert.equal(collection.dbName, dbName)
  })

  test("type inference", async () => {
    expectTypeOf(typedClient.ref)
      .parameter(0)
      .toMatchTypeOf<"test.one" | "test.two">()

    expectTypeOf(notTypedClient.ref)
      .parameter(0)
      .toMatchTypeOf<`${string}.${string}`>()

    // @ts-expect-error
    expectTypeOf(typedClient.ref).parameter(0).toMatchTypeOf<"foo">()
    // @ts-expect-error
    expectTypeOf(typedClient.ref).parameter(0).toMatchTypeOf<"foo.bar">()
    // @ts-expect-error
    expectTypeOf(typedClient.ref).parameter(0).toMatchTypeOf<"foo.">()
    // @ts-expect-error
    expectTypeOf(typedClient.ref).parameter(0).toMatchTypeOf<".">()
  })
})
