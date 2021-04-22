import * as Sentry from "@sentry/serverless"
import { deleteRecord, postToConnection, putRecord, scanRecords } from "./aws"
import { Config } from "./config"
import { ConnectionRecord, connectionRecordValidator } from "./types/connection"

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

export const sendToClient = async (
  connection: ConnectionRecord,
  data: string
): Promise<{ statusCode: number } | undefined> => {
  try {
    await postToConnection(connection.connectionId, data)
  } catch (e) {
    if (e.statusCode === 410) {
      Sentry.captureMessage(`Found stale connection, deleting ${connection.connectionId}`)
      await deleteConnectionRecord(connection.connectionId)
      return e
    }
    Sentry.captureException(e)
    return e
  }
}

export const sendToClients = async (
  connections: Array<ConnectionRecord> | undefined,
  data: string
): Promise<Array<ConnectionRecord>> => {
  if (!connections) {
    connections = await getConnectionRecords()
  }
  const responsesWithConnections = await Promise.all(
    connections.map(async (connection) => ({
      connection,
      response: await sendToClient(connection, data)
    }))
  )
  return responsesWithConnections
    .filter(({ response }) => !response || response.statusCode !== 410)
    .map(({ connection }) => connection)
}
