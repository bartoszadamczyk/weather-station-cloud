import * as faker from "faker"
import { MappingRecord } from "../../types/mapping"

export default (o: Partial<MappingRecord> = {}): MappingRecord => ({
  deviceId: faker.datatype.string(),
  moduleId: faker.datatype.string(),
  name: faker.datatype.string(),
  ...o
})
