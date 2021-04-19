import { deleteRecord, postToConnection, putRecord, scanRecords } from "./aws"
import { Config } from "./config"
import { ConnectionRecord, connectionRecordValidator } from "./types/connections"

export const putConnectionRecord = async (connectionId: string): Promise<void> => {
  await putRecord(Config.DynamoDBConnectionsTable, { connectionId })
}

export const getConnectionRecords = async (): Promise<Array<ConnectionRecord>> => {
  const records = await scanRecords(Config.DynamoDBConnectionsTable)
  return records.filter((record): record is ConnectionRecord => connectionRecordValidator(record))
}

export const deleteConnectionRecord = async (connectionId: string): Promise<void> => {
  await deleteRecord(Config.DynamoDBConnectionsTable, { connectionId })
}

export const sendToClients = async (data: string): Promise<void> => {
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
