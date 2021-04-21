process.env.NODE_ENV = "test"

// Required config env vars
process.env.STAGE = "test"
process.env.REGION = "REGION"
process.env.WEBSOCKETS_API_ID = "WEBSOCKETS_API_ID"
process.env.DYNAMODB_CONNECTIONS_TABLE = "DYNAMODB_CONNECTIONS_TABLE"
process.env.DYNAMODB_MAPPINGS_TABLE = "DYNAMODB_MAPPINGS_TABLE"

// Just in case the mock would fail
process.env.AWS_ACCESS_KEY_ID = "AWS_ACCESS_KEY_ID"
process.env.AWS_SECRET_ACCESS_KEY = "AWS_SECRET_ACCESS_KEY"
process.env.AWS_DEFAULT_REGION = "AWS_DEFAULT_REGION"

module.exports = {
  require: "ts-node/register",
  extension: ["ts"],
  watchExtensions: ["ts"],
  spec: ["src/**/*.test.ts"]
}
