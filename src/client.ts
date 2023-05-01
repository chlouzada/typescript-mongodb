import {
  CollectionOptions,
  DbOptions,
  MongoClientOptions,
  MongoClient,
  ObjectId,
} from "mongodb"
import { Key } from "./types"
import { z } from "zod"
import { toObjectId } from "./utils/toObjectId"

export let client: MongoClient

export class Client<
  T extends Record<string, readonly string[]>,
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

  // dbRef<TDbName extends keyof T & string>(
  //   key: TDbName,
  //   options?: DbOptions,
  // ): Db & {
  //   collectionRef: (
  //     key: T[TDbName][number],
  //     options?: CollectionOptions,
  //   ) => Collection
  // } {
  //   const db: any = super.db(key, options)
  //   db.collectionRef = (key: any, options?: any) => db.collection(key, options)
  //   return db
  // }

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

    const findById = async (
      id: string | ObjectId,
    ): Promise<z.infer<TSchema> | undefined> => {
      return collection.findOne({
        _id: toObjectId(id),
      }) as unknown as z.infer<TSchema>
    }

    const find = async (
      filter?: z.infer<TSchema>,
    ): Promise<z.infer<TSchema>[]> => {
      return collection
        .find(filter ?? {})
        .toArray() as unknown as z.infer<TSchema>[]
    }

    return {
      findById,
      find,
    }
  }
}

// export const model = <
//   TClient extends Record<string, readonly string[]>,
//   TSchema,
// >(
//   client: Client<TClient>,
//   key: Key<TClient>,
//   schema: z.ZodSchema<TSchema>,
// ) => {
//   return
// }

// return modelRefBuilder<
//       T,
//       Key<T> extends `${infer TDb}.${string}` ? keyof T[TDb] : never
//     >(
//       this.db(db, options?.dbOptions).collection(
//         collection,
//         options?.dbOptions,
//       ),
//       this,
//     )
// const modelRefBuilder = <
//   T extends Record<string, Record<string, boolean | z.ZodType<object>>>,
//   U extends keyof T & string,
// >(
//   collection: Collection,
//   client: MongoClient,
// ) => {
//   const findById = async (id: string): Promise<U | undefined> => {
//     return collection.findOne({ _id: new ObjectId(id) }) as unknown as U
//   }

//   return Object.assign(collection, {
//     findById,
//   })
// }
