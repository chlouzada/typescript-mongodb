import { ObjectId } from "mongodb"

const validationRegex = /^[0-9a-fA-F]{24}$/

export const toObjectId = (id: string | ObjectId): ObjectId => {
  if (id instanceof ObjectId) return id
  if (validationRegex.test(id)) return new ObjectId(id)
  throw new Error(`Invalid ObjectId: ${id}`)
}
