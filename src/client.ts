import {
  CollectionOptions,
  DbOptions,
  MongoClientOptions,
  MongoClient,
  Db,
  Collection,
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

  dbRef<K extends keyof T & string>(
    key: K,
    options?: DbOptions,
  ): Db & {
    collectionRef: (
      key: keyof T[K] & string,
      options?: CollectionOptions,
    ) => Collection
  } {
    const db = super.db(key, options)

    const collectionRef = (
      key: keyof T[K] & string,
      options?: CollectionOptions,
    ) => {
      return db.collection(key, options)
    }

    return Object.assign(db, { collectionRef })
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
