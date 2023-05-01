import {
  CollectionOptions,
  DbOptions,
  MongoClientOptions,
  MongoClient,
  ObjectId,
  Collection,
} from "mongodb"
import { Key } from "./types"
import { z } from "zod"
import { toObjectId } from "./utils/toObjectId"

export let client: MongoClient

export class Client<
  T extends Record<string, readonly string[]>,
> extends MongoClient {
  constructor({ uri, options }: { uri: string; options?: MongoClientOptions }) {
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

  model<TSchema extends z.ZodTypeAny>(key: Key<T>, schema: TSchema) {
    const [dbName, collectionName] = key.split(".")
    const collection = this.db(dbName).collection(collectionName)
    return {
      findById: findById<TSchema>(collection),
      find: find<TSchema>(collection),
    }
  }
}

const find =
  <TSchema extends z.ZodTypeAny>(collection: Collection) =>
  async (filter?: z.infer<TSchema>): Promise<z.infer<TSchema>[]> =>
    collection.find(filter ?? {}).toArray() as unknown as z.infer<TSchema>[]

const findById =
  <TSchema extends z.ZodTypeAny>(collection: Collection) =>
  async (id: string | ObjectId): Promise<z.infer<TSchema> | undefined> =>
    collection.findOne({
      _id: toObjectId(id),
    }) as unknown as z.infer<TSchema>
