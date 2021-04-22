import { getRecord } from "./aws"
import { Config } from "./config"
import { DeviceSortKey, MappingRecord, mappingRecordValidator } from "./types/mapping"

export const getMappingRecord = async (deviceId: string, moduleId: string = DeviceSortKey): Promise<MappingRecord> => {
  const condition = "deviceId = :deviceId AND moduleId = :moduleId"
  const values = { ":deviceId": deviceId, ":moduleId": moduleId }
  const records = await getRecord(Config.DynamoDBMappingsTable, condition, values)
  return records.filter((record): record is MappingRecord => mappingRecordValidator(record))[0]
}
