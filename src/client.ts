import {
  CollectionOptions,
  DbOptions,
  MongoClientOptions,
  MongoClient,
  Db,
  Collection,
} from "mongodb"
import { Key } from "./types"
import { z } from "zod"

export let client: MongoClient

export class Client<
  T extends Record<string, Record<string, boolean | z.ZodType<object>>>,
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
    const db: any = super.db(key, options)

    const collectionRef = (
      key: keyof T[K] & string,
      options?: CollectionOptions,
    ) => {
      return db.collection(key, options)
    }

    db.collectionRef = collectionRef

    return db
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
