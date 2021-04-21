import * as faker from "faker"
import { SQSRecord } from "aws-lambda/trigger/sqs"

export default (body: unknown | undefined, o: Partial<SQSRecord> = {}): SQSRecord => ({
  messageId: faker.datatype.string(),
  receiptHandle: faker.datatype.string(),
  body: body ? JSON.stringify(body) : faker.datatype.string(),
  attributes: {
    ApproximateReceiveCount: faker.datatype.string(),
    SentTimestamp: faker.datatype.string(),
    SenderId: faker.datatype.string(),
    ApproximateFirstReceiveTimestamp: faker.datatype.string()
  },
  messageAttributes: {},
  md5OfBody: faker.datatype.string(),
  eventSource: faker.datatype.string(),
  eventSourceARN: faker.datatype.string(),
  awsRegion: faker.datatype.string(),
  ...o
})
