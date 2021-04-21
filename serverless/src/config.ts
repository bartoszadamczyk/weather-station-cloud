import { getEnvVar, getReqEnvVar } from "./helpers"

export enum Environment {
  Production = "production",
  Development = "development",
  Test = "test"
}

export const Config = {
  Stage: getReqEnvVar("STAGE"),
  Region: getReqEnvVar("REGION"),
  WebsocketsApiId: getReqEnvVar("WEBSOCKETS_API_ID"),
  DynamoDBConnectionsTable: getReqEnvVar("DYNAMODB_CONNECTIONS_TABLE"),
  DynamoDBMappingsTable: getReqEnvVar("DYNAMODB_MAPPINGS_TABLE"),
  SentrySampleRate: getEnvVar("SENTRY_SAMPLE_RATE"),
  SentryTracesSampleRate: getEnvVar("SENTRY_TRACES_SAMPLE_RATE")
}
