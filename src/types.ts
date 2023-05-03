import { ObjectId } from "mongodb"

export type Document<T> = T & { _id: ObjectId | string }

export type Key<TObject extends Record<string, readonly string[]>> = {
  [TKeyDb in keyof TObject & string]: `${TKeyDb}.${TObject[TKeyDb][number]}`
}[keyof TObject & string]
