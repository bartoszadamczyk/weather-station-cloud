import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult, Context, SQSEvent, SQSHandler } from "aws-lambda"
import { returnInternalServerError, returnOk, returnOkJSON } from "./helpers"
import { deleteConnectionRecord, getConnectionRecords, putConnectionRecord } from "./aws-helpers"
import { postToConnection } from "./aws"

export const connectHandler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId
  if (!connectionId) {
    console.log("Missing connectionId", event)
    return returnInternalServerError()
  }
  await putConnectionRecord(connectionId)
  return returnOk()
}

export const disconnectHandler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId
  if (!connectionId) {
    console.log("Missing connectionId", event)
    return returnInternalServerError()
  }
  await deleteConnectionRecord(connectionId)
  return returnOk()
}

export const pingHandler: Handler = async (): Promise<APIGatewayProxyResult> => {
  return returnOkJSON({ action: "pong" })
}

export const dataHandler: SQSHandler = async (event: SQSEvent): Promise<void> => {
  const records = event.Records
  if (!records.length) {
    console.log("Missing body", event)
    throw new Error("Missing body")
  }
  const body = records[0].body

  const connections = await getConnectionRecords()
  if (!connections.length) {
    console.log("No connections")
    return
  }

  await Promise.all(
    connections.map(async ({ connectionId }) => {
      try {
        await postToConnection(connectionId, body)
      } catch (e) {
        if (e.statusCode === 410) {
          console.log(`Found stale connection, deleting ${connectionId}`)
          return await deleteConnectionRecord(connectionId)
        }
        console.log(e)
        throw e
      }
    })
  )
}
