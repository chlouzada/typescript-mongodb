# typescript-mongodb

Simple API layer for MongoDB with TypeScript support.

This is a work in progress.

## Usage

```ts
import { Client } from "typescript-mongodb"

type Config = {
  'my-db': ['collection1', 'collection2']
}

const client = new Client<Config>({
  uri,
})

const ref = client.ref('my-db.collection1')
```

### Model

```ts
const PersonModel = typedClient.model(
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

const person = await PersonModel.find(...)
// typed as:
// {
//  name: string;
//  age: number;
//  pets?: ObjectId[] | undefined;
//  favorite?: ObjectId | undefined;
// }

const personPopulated = await PersonModel.findById(personId, {
  populate: {
    favorite: true,
    pets: true,
  },
})
//  typed as:
// {
//   name: string;
//   age: number;
//   pets: unknown;
//   favorite: unknown;
//   _id: ObjectId;
// } | undefined

```
