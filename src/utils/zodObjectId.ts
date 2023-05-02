import { ObjectId } from "mongodb"
import { z } from "zod"

export const zodObjectId = z.custom<ObjectId>((val) => {
  if (val instanceof ObjectId) {
    return { success: true, data: val }
  }
  if (typeof val === "string" && /^[0-9a-fA-F]{24}$/.test(val)) {
    return { success: true, data: new ObjectId(val) }
  }
  return { success: false, error: "Invalid ObjectId" }
})
