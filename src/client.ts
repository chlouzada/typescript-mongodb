import {
  CollectionOptions,
  DbOptions,
  MongoClientOptions,
  MongoClient,
  ObjectId,
  Collection,
} from "mongodb"
import { Key, KeyCollection, Prettify } from "./types"
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

  model<
    TSchema extends z.ZodTypeAny,
    TOptions extends {
      // TODO: restrict to only allow keys of type string / Array<string>
      refs?: Partial<Record<keyof z.infer<TSchema>, KeyCollection<Key<T>>>>
    },
  >(key: Key<T>, schema: TSchema, options?: TOptions) {
    const [dbName, collectionName] = key.split(".")
    const collection = this.db(dbName).collection(collectionName)
    return {
      findById: findById<Key<T>, TSchema, TOptions>(collection, options),
      find: find<TSchema>(collection),
    }
  }
}

const find =
  <TSchema extends z.ZodTypeAny>(collection: Collection) =>
  async (filter?: z.infer<TSchema>): Promise<z.infer<TSchema>[]> =>
    collection.find(filter ?? {}).toArray() as unknown as z.infer<TSchema>[]

const findById = <
  TKey extends `${string}.${string}`,
  TSchema extends z.ZodTypeAny,
  TOptions extends {
    // TODO: restrict to only allow keys of type string / Array<string>
    refs?: Partial<Record<keyof z.infer<TSchema>, KeyCollection<TKey>>>
  },
>(
  collection: Collection,
  options?: TOptions,
) => {
  const { refs } = options ?? {}
  function fn<T extends Partial<Record<keyof TOptions["refs"], true>>>(
    id: string | ObjectId,
    options: {
      populate: Prettify<T>
    },
  ): Promise<
    | Prettify<
        Document<
          Omit<z.infer<TSchema>, keyof T> & {
            [K in keyof TOptions["refs"]]: z.infer<TSchema>[K] extends Array<any>
              ? unknown[]
              : unknown
          }
        >
      >
    | undefined
  >
  function fn(
    id: string | ObjectId,
  ): Promise<Prettify<Document<z.infer<TSchema>>> | undefined>
  async function fn(): Promise<unknown> {
    const [id, options] = arguments as unknown as [
      string | ObjectId,
      {
        populate: TOptions["refs"]
      }?,
    ]
    if (options?.populate) {
      const lookup = Object.keys(options.populate).map((key) => ({
        $lookup: {
          // FIXME: could break
          from: refs![key],
          localField: key,
          foreignField: "_id",
          as: key,
        },
      }))
      const populated = await collection
        .aggregate([
          {
            $match: {
              _id: toObjectId(id),
            },
          },
          ...lookup,
        ])
        .toArray()
      return populated[0]
    }
    return collection.findOne({
      _id: toObjectId(id),
    })
  }
  return fn
}

type Document<T> = T & { _id: ObjectId }
