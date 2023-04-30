import { ObjectId } from "mongodb"

export type Document<T> = T & { _id: ObjectId | string }

export type AnyObject = Record<string, any>

export type Key<TObject extends AnyObject> = {
  [TKeyDb in keyof TObject & string]: `${TKeyDb}.${keyof {
    [TKeyCollection in keyof TObject[TKeyDb] & string]: TKeyCollection
  }}`
}[keyof TObject & string]

export type Collection<T extends AnyObject> = {
  [K in Key<T>]: T[K]
}
