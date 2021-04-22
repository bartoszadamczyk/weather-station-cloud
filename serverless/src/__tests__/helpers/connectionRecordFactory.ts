import * as faker from "faker"
import { ConnectionRecord } from "../../types/connection"

export default (o: Partial<ConnectionRecord> = {}): ConnectionRecord => ({
  connectionId: faker.datatype.string(),
  ...o
})
