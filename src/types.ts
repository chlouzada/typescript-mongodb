import { ObjectId } from "mongodb"

export type Document<T> = T & { _id: ObjectId | string }

export type Key<TObject extends Record<string, unknown>> = {
  [TKeyDb in keyof TObject & string]: `${TKeyDb}.${keyof {
    [TKeyCollection in keyof TObject[TKeyDb] & string]: TKeyCollection
  }}`
}[keyof TObject & string]

export type Collection<TObject extends Record<string, any>> = {
  [TKey in Key<TObject>]: TObject[TKey]
}
