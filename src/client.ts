import {
  CollectionOptions,
  DbOptions,
  MongoClientOptions,
  MongoClient,
} from "mongodb"
import { Key } from "./types"

export class Client<
  T extends Record<string, readonly string[]>,
> extends MongoClient {
  constructor({ uri, options }: { uri: string; options?: MongoClientOptions }) {
    super(uri, options)
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
