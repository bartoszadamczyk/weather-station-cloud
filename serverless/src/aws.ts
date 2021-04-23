import { ApiGatewayManagementApi } from "aws-sdk"
import { DeleteItemCommandInput } from "@aws-sdk/client-dynamodb/commands/DeleteItemCommand"
import { DynamoDB, QueryCommandInput, ScanCommandInput } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

import { Config } from "./config"

const ApiGatewayUrl = `${Config.WebsocketsApiId}.execute-api.${Config.Region}.amazonaws.com/${Config.Stage}`

const dynamoDB = new DynamoDB({ region: Config.Region })

// For now using sdk-v2 until the bug is fixed, remove as soon as possible
// https://github.com/aws/aws-sdk-js-v3/issues/1830
const apiGatewayManagementApi = new ApiGatewayManagementApi({ endpoint: ApiGatewayUrl })

export const postToConnection = async (connectionId: string, data: string): Promise<void> => {
  await apiGatewayManagementApi.postToConnection({ ConnectionId: connectionId, Data: data }).promise()
}

export const putRecord = async (dynamoDDTable: string, item: Record<string, unknown>): Promise<void> => {
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
): Promise<Array<Record<string, unknown>>> => {
  const params = {
    TableName: dynamoDBTable,
    ...args
  }
  const results = await dynamoDB.scan(params)
  return results.Items ? results.Items.map((item) => unmarshall(item)) : []
}

export const getRecord = async (
  dynamoDBTable: string,
  condition: string,
  values: Record<string, unknown>,
  args: Partial<QueryCommandInput> = {}
): Promise<Array<Record<string, unknown>>> => {
  const params = {
    TableName: dynamoDBTable,
    KeyConditionExpression: condition,
    ExpressionAttributeValues: marshall(values),
    ...args
  }
  const results = await dynamoDB.query(params)
  return results.Items ? results.Items.map((item) => unmarshall(item)) : []
}

export const deleteRecord = async (
  dynamoDBTable: string,
  keyCondition: Record<string, unknown>,
  args: Partial<DeleteItemCommandInput> = {}
): Promise<void> => {
  const params = {
    TableName: dynamoDBTable,
    Key: marshall(keyCondition),
    ...args
  }
  await dynamoDB.deleteItem(params)
}
