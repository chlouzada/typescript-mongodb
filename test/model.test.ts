import { test, assert, describe } from "vitest"
import { typedClient } from "./setup"
import { type } from "../src"
import { ObjectId } from "mongodb"

describe("model testing", () => {
  test("1", async () => {
    const refPersons = typedClient.ref("test.one")
    const refPets = typedClient.ref("test.two")

    const { insertedId: personId } = await refPersons.insertOne({
      name: "John",
      age: 20,
    })

    const { insertedId: petId } = await refPets.insertOne({
      name: "Fluffy",
      owner: personId,
    })

    await refPersons.updateOne(
      { _id: personId },
      {
        $push: {
          pets: petId,
        },
      },
    )

    const PersonModel = typedClient.model(
      "test.one",
      type.object({
        name: type.string,
        age: type.number,
        pets: type.array(type.objectId).optional(),
        favorite: type.objectId,
      }),
      {
        refs: {
          pets: "two",
          favorite: "two",
        },
      },
    )

    const notFound = await PersonModel.findById("000000000000000000000000")
    assert.equal(notFound, undefined)

    const unpopulated = await PersonModel.findById(personId)
    //    ^?
    assert(unpopulated?.pets instanceof Array)
    assert.equal(unpopulated?.pets.length, 1)
    assert.equal(unpopulated?.name, "John")
    assert.equal(unpopulated?.age, 20)
    assert.equal(unpopulated?.pets[0].toString(), petId.toString())
    expectTypeOf(unpopulated?.pets).toEqualTypeOf<ObjectId[]>()
    expectTypeOf(unpopulated?.favorite).toEqualTypeOf<ObjectId>()

    const partialPopulated = await PersonModel.findById(personId, {
      //     ^?
      populate: {
        pets: true,
      },
    })
    assert(partialPopulated?.pets instanceof Array)
    assert.equal(partialPopulated?.pets.length, 1)
    assert.equal(partialPopulated?.name, "John")
    assert.equal(partialPopulated?.age, 20)
    expectTypeOf(partialPopulated?.pets).toEqualTypeOf<unknown[]>()
    expectTypeOf(partialPopulated?.favorite).toEqualTypeOf<ObjectId>()

    const allPopulated = await PersonModel.findById(personId, {
      //     ^?
      populate: {
        pets: true,
        favorite: true,
      },
    })
    assert(allPopulated?.pets instanceof Array)
    assert.equal(allPopulated?.pets.length, 1)
    assert.equal(allPopulated?.name, "John")
    assert.equal(allPopulated?.age, 20)
    expectTypeOf(allPopulated?.pets).toEqualTypeOf<unknown[]>()
    expectTypeOf(allPopulated?.favorite).toEqualTypeOf<unknown>()
  })
})
