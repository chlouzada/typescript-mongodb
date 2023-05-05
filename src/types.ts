import { ObjectId } from "mongodb"

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Document<T> = T & { _id: ObjectId | string }

export type Key<TObject extends Record<string, readonly string[]>> = {
  [TKeyDb in keyof TObject & string]: `${TKeyDb}.${TObject[TKeyDb][number]}`
}[keyof TObject & string]

export type KeyCollection<T extends `${string}.${string}`> =
  T extends `${string}.${infer TCollection}` ? TCollection : never
