import { deleteRecord, postToConnection, putRecord, scanRecords } from "./aws"
import { getEnvVar } from "./helpers"
import { ConnectionRecord, connectionRecordValidator } from "./types/connections"

const DYNAMODB_CONNECTIONS_TABLE = getEnvVar("DYNAMODB_CONNECTIONS_TABLE")

export const putConnectionRecord = async (connectionId: string): Promise<void> => {
  await putRecord(DYNAMODB_CONNECTIONS_TABLE, { connectionId })
}

export const getConnectionRecords = async (): Promise<Array<ConnectionRecord>> => {
  const records = await scanRecords(DYNAMODB_CONNECTIONS_TABLE)
  return records.filter((record): record is ConnectionRecord => connectionRecordValidator(record))
}

export const deleteConnectionRecord = async (connectionId: string): Promise<void> => {
  await deleteRecord(DYNAMODB_CONNECTIONS_TABLE, { connectionId })
}

export const sendToClients = async (data: string) => {
  const connections = await getConnectionRecords()
  for (const { connectionId } of connections) {
    try {
      await postToConnection(connectionId, data)
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`)
        return await deleteConnectionRecord(connectionId)
      }
      console.log(e)
    }
  }
}
