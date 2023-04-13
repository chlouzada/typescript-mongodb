import { ObjectId } from "mongodb"

export type StringOrObjectId = ObjectId | string

export type Document<T> = T & { _id: StringOrObjectId }

export type Object = Record<string, any>

export type Key<T extends Object> = {
  [K in keyof T & string]: T[K] extends Object ? `${K}.${Nested<T[K]>}` : never
}[keyof T & string]

export type Nested<T extends Object> = keyof {
  [K in keyof T & string]: T[K] extends object ? K : never
}
