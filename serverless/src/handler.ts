import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult, SQSEvent, SQSHandler } from "aws-lambda"
import { dateToTimestamp } from "./helpers"
import { returnOk } from "./http"
import { deleteConnectionRecord, putConnectionRecord, sendToClients } from "./clients"
import { ActionType, actionSerializer, actionParser } from "./types/actions"
import { enrichLiveReadingAction } from "./actions"

export const connectHandler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId as string
  await putConnectionRecord(connectionId)
  return returnOk()
}

export const disconnectHandler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId as string
  await deleteConnectionRecord(connectionId)
  return returnOk()
}

export const pingHandler: Handler = async (): Promise<APIGatewayProxyResult> => {
  const response = {
    action: ActionType.Pong as const,
    server_time: dateToTimestamp(new Date())
  }
  return returnOk(actionSerializer(response))
}

export const dataHandler: SQSHandler = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    const action = actionParser(record.body)
    if (action) {
      switch (action.action) {
        case ActionType.LiveReading:
          await sendToClients(actionSerializer(await enrichLiveReadingAction(action)))
          break
        case ActionType.Pong:
          break
      }
    }
  }
}
