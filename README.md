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
