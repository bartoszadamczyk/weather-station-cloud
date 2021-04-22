import Ajv, { JTDSchemaType } from "ajv/dist/jtd"

const ajv = new Ajv()

export type MappingRecord = {
  deviceId: string
  moduleId: string
  name: string
}

export const DeviceSortKey = "device"

const mappingRecordSchema: JTDSchemaType<MappingRecord> = {
  properties: {
    deviceId: { type: "string" },
    moduleId: { type: "string" },
    name: { type: "string" }
  },
  additionalProperties: true // Open–closed principle
}

export const mappingRecordValidator = ajv.compile<MappingRecord>(mappingRecordSchema)
