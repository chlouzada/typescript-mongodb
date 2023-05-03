import { test, assert, describe } from "vitest"
import { typedClient } from "./setup"
import { type } from "../src"

describe("model testing", () => {
  test("1", async () => {
    const refPersons = typedClient.ref("test.one")
    const refPets = typedClient.ref("test.two")
    // const doc = await ref.findById(id)

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
      }),
      {
        refs: {
          pets: "two",
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

    const populated = await PersonModel.findById(personId, {
      //     ^?
      populate: {
        pets: true,
      },
    })
    assert(populated?.pets instanceof Array)
    assert.equal(populated?.pets.length, 1)
    assert.equal(populated?.name, "John")
    assert.equal(populated?.age, 20)
    // expectTypeOf(populated?.pets).toEqualTypeOf<unknown[]>()

    const populated1 = await PersonModel.findById(personId)
    //     ^?

    const populated2 = await PersonModel.findById(personId, {
      //     ^?
      populate: {
        pets: true,
      },
    })

    const search2 = await PersonModel.find()
    assert.equal(search2.length, 1)
    assert.equal(search2[0].name, "John")
    assert.equal(search2[0].age, 20)
  })
})
