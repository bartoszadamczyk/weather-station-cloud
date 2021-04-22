import { getOptionalEnvironmentVariable, getRequiredEnvironmentVariable } from "./helper"

export enum Environment {
  Production = "production",
  Development = "development",
  Test = "test"
}

export const Config = {
  Stage: getRequiredEnvironmentVariable("STAGE"),
  Region: getRequiredEnvironmentVariable("REGION"),
  WebsocketsApiId: getRequiredEnvironmentVariable("WEBSOCKETS_API_ID"),
  DynamoDBConnectionsTable: getRequiredEnvironmentVariable("DYNAMODB_CONNECTIONS_TABLE"),
  DynamoDBMappingsTable: getRequiredEnvironmentVariable("DYNAMODB_MAPPINGS_TABLE"),
  SentrySampleRate: getOptionalEnvironmentVariable("SENTRY_SAMPLE_RATE"),
  SentryTracesSampleRate: getOptionalEnvironmentVariable("SENTRY_TRACES_SAMPLE_RATE")
}
