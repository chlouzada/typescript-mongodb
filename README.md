# typescript-mongodb

Simple API layer for MongoDB with TypeScript support.

## Install

## Usage

```ts
import { Client } from "typescript-mongodb"

const options = {
  uri,
  db: {
    first: {
      collectionOfFirstDb: true,
    },
    second: {
      collectionOfSecondDb: true,
    },
  },
}

const client = new Client(options)


const collection = client.ref('first.collectionOfFirstDb')

// OR

const db = client.dbRef('first')
const collection = db.collectionRef('collectionOfFirstDb')

```
