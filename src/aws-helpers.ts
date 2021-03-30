import { deleteRecord, putRecord, scanRecords } from "./aws"
import { getEnvVar } from "./helpers"

const DYNAMODB_CONNECTIONS_TABLE = getEnvVar("DYNAMODB_CONNECTIONS_TABLE")

export const putConnectionRecord = async (connectionId: string): Promise<void> => {
  await putRecord(DYNAMODB_CONNECTIONS_TABLE, { connectionId })
}

type ConnectionsRecords = Array<{ connectionId: string }>
export const getConnectionRecords = async (): Promise<ConnectionsRecords> => {
  return (await scanRecords(DYNAMODB_CONNECTIONS_TABLE)) as ConnectionsRecords
}

export const deleteConnectionRecord = async (connectionId: string): Promise<void> => {
  await deleteRecord(DYNAMODB_CONNECTIONS_TABLE, { connectionId: { S: connectionId } })
}
