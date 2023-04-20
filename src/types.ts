import { ObjectId } from "mongodb"

export type Document<T> = T & { _id: ObjectId | string }

export type AnyObject = Record<string, any>

export type Key<T extends AnyObject> = {
  [K in keyof T & string]: T[K] extends AnyObject
    ? `${K}.${Nested<T[K]>}`
    : never
}[keyof T & string]

export type Nested<T extends AnyObject> = keyof {
  [K in keyof T & string]: T[K] extends object ? K : never
}

export type Collection<T extends AnyObject> = {
  [K in Key<T>]: T[K]
}
