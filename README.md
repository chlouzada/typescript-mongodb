# typescript-mongodb

Simple API layer for MongoDB with TypeScript support.

This is a work in progress.

## Install

## Usage

```ts
import { Client } from "typescript-mongodb"

type Config = {
  'my-data-base': ['collection1', 'collection2']
}

const client = new Client<Config>({
  uri,
})


const collection = client.ref('first.collectionOfFirstDb')

// OR

const db = client.dbRef('first')
const collection = db.collectionRef('collectionOfFirstDb')

```
