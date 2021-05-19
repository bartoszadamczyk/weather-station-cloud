import * as Sentry from "@sentry/serverless"
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult, SQSEvent, SQSHandler } from "aws-lambda"
import { returnOk, returnOkJSON } from "./http"
import { deleteConnectionRecord, putConnectionRecord } from "./client"
import { handleEvent } from "./event"
import { Config, Environment } from "./config"

Sentry.AWSLambda.init({
  enabled: Config.Stage !== Environment.Test,
  sampleRate: Config.SentrySampleRate ? parseFloat(Config.SentrySampleRate) : 0.001,
  tracesSampleRate: Config.SentryTracesSampleRate ? parseFloat(Config.SentryTracesSampleRate) : 0.001
})

export const connectHandler: Handler = Sentry.AWSLambda.wrapHandler(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const connectionId = event.requestContext.connectionId as string
    await putConnectionRecord(connectionId)
    return returnOk()
  }
)

export const disconnectHandler: Handler = Sentry.AWSLambda.wrapHandler(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const connectionId = event.requestContext.connectionId as string
    await deleteConnectionRecord(connectionId)
    return returnOk()
  }
)

export const pingHandler: Handler = Sentry.AWSLambda.wrapHandler(async (): Promise<APIGatewayProxyResult> => {
  const response = { action: "pong" }
  return returnOkJSON(response)
})

export const eventHandler: SQSHandler = Sentry.AWSLambda.wrapHandler(async (event: SQSEvent): Promise<void> => {
  let connections
  for (const record of event.Records) {
    connections = await handleEvent(connections, record.body)
  }
})
