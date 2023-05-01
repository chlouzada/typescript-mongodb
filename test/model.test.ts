import { test, assert, describe } from "vitest"

import { typedClient } from "./setup"
import { z } from "zod"

describe("model testing", () => {
  test("1", async () => {
    const ref = typedClient.ref("first.persons")
    // const doc = await ref.findById(id)

    const { insertedId } = await ref.insertOne({
      name: "John",
      age: 20,
    })

    const PersonModel = typedClient.model(
      "first.persons",
      z.object({
        name: z.string(),
        age: z.number(),
      }),
    )

    const search1 = await PersonModel.findById(insertedId)
    assert.equal(search1?.name, "John")
    assert.equal(search1?.age, 20)

    const search2 = await PersonModel.find()
    assert.equal(search2.length, 1)
    assert.equal(search2[0].name, "John")
    assert.equal(search2[0].age, 20)
  })
})
