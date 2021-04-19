import Ajv, { JTDSchemaType } from "ajv/dist/jtd"

const ajv = new Ajv()

export enum ModuleType {
  CPU = "cpu",
  DHT22 = "dht22",
  DS18B20 = "ds18b20",
  BME680 = "bme680",
  Relay = "relay"
}

export enum MetricType {
  Temperature = "temperature",
  Humidity = "humidity",
  Pressure = "pressure",
  Gas = "gas",
  Init = "init",
  State = "state",
  Change = "change",
  Cleanup = "cleanup"
}

export enum ActionType {
  Pong = "pong",
  LiveReading = "live_reading",
  AggregatedReading = "aggregated_reading"
}

export type PongAction = {
  action: ActionType.Pong
  server_time: number
}

export type LiveReadingAction = {
  action: ActionType.LiveReading
  device_id: string
  device_name?: string
  created_on: number
  module_type: ModuleType
  module_id: string
  module_name?: string
  metric: MetricType
  value: number
}

export type AggregatedReadingAction = {
  action: ActionType.AggregatedReading
  device_id: string
  device_name?: string
  started_on: number
  finished_on: number
  module_type: ModuleType
  module_id: string
  module_name?: string
  metric: MetricType
  first: number
  last: number
  min: number
  max: number
  mean: number
  median: number
  range: 5
}

export type ActionSchemaType = PongAction | LiveReadingAction

const actionSchema: JTDSchemaType<ActionSchemaType> = {
  discriminator: "action",
  mapping: {
    pong: {
      properties: {
        server_time: { type: "float64" }
      },
      additionalProperties: true // Open–closed principle
    },
    live_reading: {
      properties: {
        device_id: { type: "string" },
        created_on: { type: "float64" },
        module_type: { enum: Object.values(ModuleType) },
        module_id: { type: "string" },
        metric: { enum: Object.values(MetricType) },
        value: { type: "float64" }
      },
      optionalProperties: {
        device_name: { type: "string" },
        module_name: { type: "string" }
      },
      additionalProperties: true // Open–closed principle
    }
  }
}

export const actionParser = ajv.compileParser<ActionSchemaType>(actionSchema)
export const actionSerializer = ajv.compileSerializer<ActionSchemaType>(actionSchema)
