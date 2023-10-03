# typescript-mongodb

Simple API layer for MongoDB with TypeScript support.

This is a work in progress.

## Usage

### Client

```ts
import { Client } from "typescript-mongodb"

type Config = {
  'my-db': ['collection1', 'collection2']
}

const client = new Client<Config>({
  uri,
})

const ref = client.ref('my-db.collection1') // typesafe
```

### Model
```ts
const PersonModel = client.model(
  "my-db.collection1",
  type.object({
    name: type.string,
    age: type.number,
    pets: type.array(type.objectId).optional(),
    favorite: type.objectId.optional(),
  }),
  {
    refs: {
      pets: "collection2",
      favorite: "collection2",
    },
  },
)

const person = await PersonModel.findById(personId)
//  typed as:
//  {
//    name: string;
//    age: number;
//    pets: ObjectId[] | undefined;
//    favorite: ObjectId | undefined;
//    _id: ObjectId;
//  } | undefined

const populated = await PersonModel.findById(personId, { populate: { pets: true, },})
//  typed as:
//  {
//    name: string;
//    age: number;
//    pets: unknown;
//    favorite: ObjectId | undefined;
//    _id: ObjectId;
//  } | undefined

const persons = await PersonModel.find(...)
//  typed as:
//  {
//    name: string;
//    age: number;
//    pets: ObjectId[] | undefined;
//    favorite: ObjectId | undefined;
//    _id: ObjectId;
//  }[]
```
