import {
  CollectionOptions,
  DbOptions,
  MongoClientOptions,
  MongoClient,
} from "mongodb"
import { z } from "zod"
import { Key } from "./types"

export let client: MongoClient

export class Client<
  T extends Record<string, Record<string, z.ZodType<object>>>,
> extends MongoClient {
  constructor({
    db,
    uri,
    options,
  }: {
    uri: string
    db: T
    options?: MongoClientOptions
  }) {
    super(uri, options)
    client = this
  }

  ref(
    key: Key<T>,
    options?: {
      dbOptions?: DbOptions
      collectionOptions?: CollectionOptions
    },
  ) {
    const [db, collection] = key.split(".")
    return this.db(db, options?.dbOptions).collection(
      collection,
      options?.dbOptions,
    )
  }
}
