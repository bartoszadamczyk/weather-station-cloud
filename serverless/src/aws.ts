import { ApiGatewayManagementApi } from "aws-sdk"
import { DeleteItemCommandInput } from "@aws-sdk/client-dynamodb/commands/DeleteItemCommand"
import { DynamoDB, ScanCommandInput } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

import { getEnvVar } from "./helpers"

const REGION = getEnvVar("REGION")
const STAGE = getEnvVar("STAGE")
const WEBSOCKETS_API_UID = getEnvVar("WEBSOCKETS_API_UID")

const API_GATEWAY_URL = `${WEBSOCKETS_API_UID}.execute-api.${REGION}.amazonaws.com/${STAGE}`

const dynamoDB = new DynamoDB({ region: REGION })

// For now using sdk-v2 until the bug is fixed
// https://github.com/aws/aws-sdk-js-v3/issues/1830
const apiGatewayManagementApi = new ApiGatewayManagementApi({ endpoint: API_GATEWAY_URL })

export const postToConnection = async (connectionId: string, data: any): Promise<void> => {
  await apiGatewayManagementApi.postToConnection({ ConnectionId: connectionId, Data: data }).promise()
}

export const putRecord = async (dynamoDDTable: string, item: Record<string, any>): Promise<void> => {
  const params = {
    Item: marshall(item),
    ReturnConsumedCapacity: "NONE",
    TableName: dynamoDDTable
  }
  await dynamoDB.putItem(params)
}

export const scanRecords = async (
  dynamoDBTable: string,
  args: Partial<ScanCommandInput> = {}
): Promise<Array<Record<string, any>>> => {
  const params = {
    TableName: dynamoDBTable,
    ...args
  }
  const results = await dynamoDB.scan(params)
  return results.Items ? results.Items.map((item) => unmarshall(item)) : []
}

export const deleteRecord = async (
  dynamoDBTable: string,
  keyCondition: Record<string, any>,
  args: Partial<DeleteItemCommandInput> = {}
): Promise<void> => {
  const params = {
    TableName: dynamoDBTable,
    Key: marshall(keyCondition),
    ...args
  }
  await dynamoDB.deleteItem(params)
}
