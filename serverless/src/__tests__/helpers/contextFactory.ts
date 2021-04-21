import * as faker from "faker"
import { Context } from "aws-lambda"

export default (o: Partial<Context> = {}): Context => ({
  awsRequestId: faker.datatype.string(),
  callbackWaitsForEmptyEventLoop: false,
  functionName: faker.datatype.string(),
  functionVersion: faker.datatype.string(),
  invokedFunctionArn: faker.datatype.string(),
  logGroupName: faker.datatype.string(),
  logStreamName: faker.datatype.string(),
  memoryLimitInMB: faker.datatype.string(),
  done: (): void => undefined,
  fail: (): void => undefined,
  getRemainingTimeInMillis: (): number => faker.datatype.number(),
  succeed: (): void => undefined,
  ...o
})
