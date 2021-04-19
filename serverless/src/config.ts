import { getEnvVar } from "./helpers"

export const Config = {
  Stage: getEnvVar("STAGE"),
  Region: getEnvVar("REGION"),
  WebsocketsApiId: getEnvVar("WEBSOCKETS_API_ID"),
  DynamoDBConnectionsTable: getEnvVar("DYNAMODB_CONNECTIONS_TABLE"),
  DynamoDBMappingsTable: getEnvVar("DYNAMODB_MAPPINGS_TABLE"),
  SentryDsn: getEnvVar("SENTRY_DSN"),
  SentrySampleRate: parseFloat(getEnvVar("SENTRY_SAMPLE_RATE")) || 0.0005,
  SentryTracesSampleRate: parseFloat(getEnvVar("SENTRY_TRACES_SAMPLE_RATE")) || 0.0001
}
