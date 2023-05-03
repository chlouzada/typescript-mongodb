import { ObjectId } from "mongodb"
import { z } from "zod"

const string = z.string()

const objectId = z.custom<ObjectId>((val) => {
  if (val instanceof ObjectId) {
    return { success: true, data: val }
  }
  if (typeof val === "string" && /^[0-9a-fA-F]{24}$/.test(val)) {
    return { success: true, data: new ObjectId(val) }
  }
  return { success: false, error: "Invalid ObjectId" }
})

const date = z.string().datetime({ offset: true })

const boolean = z.boolean()

const number = z.number()

const any = z.any()

const array = <T extends z.ZodTypeAny>(schema: T) => z.array(schema)

const object = <T extends z.ZodRawShape>(shape: T) => z.object(shape)

export const validators = {
  string,
  objectId,
  date,
  array,
  object,
  boolean,
  number,
  any,
}
