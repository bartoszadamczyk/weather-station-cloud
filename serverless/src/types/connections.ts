import Ajv, { JTDSchemaType } from "ajv/dist/jtd"

const ajv = new Ajv()

export type ConnectionRecord = {
  connectionId: string
}

const connectionRecordSchema: JTDSchemaType<ConnectionRecord> = {
  properties: {
    connectionId: { type: "string" }
  }
}

export const connectionRecordValidator = ajv.compile(connectionRecordSchema)
