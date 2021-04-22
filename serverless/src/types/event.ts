import Ajv, { JTDSchemaType } from "ajv/dist/jtd"

const ajv = new Ajv()

export enum ModuleType {
  RPI = "rpi",
  DHT22 = "dht22",
  DS18B20 = "ds18b20",
  BME680 = "bme680",
  Relay = "relay"
}

export enum MetricType {
  Temperature = "temperature",
  Humidity = "humidity",
  Pressure = "pressure",
  Vox = "vox",
  State = "state"
}

export enum EventType {
  LiveReading = "live_reading",
  AggregatedReading = "aggregated_reading"
}

export type LiveReadingRawEvent = {
  event_type: EventType.LiveReading
  device_id: string
  device_name?: string
  created_on: number
  module_type: ModuleType
  module_id: string
  module_name?: string
  metric_type: MetricType
  metric_value: number
}

export type AggregatedReadingRawEvent = {
  event_type: EventType.AggregatedReading
  device_id: string
  device_name?: string
  started_on: number
  finished_on: number
  module_type: ModuleType
  module_id: string
  module_name?: string
  metric_type: MetricType
  first_value: number
  last_value: number
  min_value: number
  max_value: number
  mean_value: number
  median_value: number
  readings_no: number
}

export type RawEvent = LiveReadingRawEvent | AggregatedReadingRawEvent

const actionSchema: JTDSchemaType<RawEvent> = {
  discriminator: "event_type",
  mapping: {
    live_reading: {
      properties: {
        device_id: { type: "string" },
        created_on: { type: "float64" },
        module_type: { enum: Object.values(ModuleType) },
        module_id: { type: "string" },
        metric_type: { enum: Object.values(MetricType) },
        metric_value: { type: "float64" }
      },
      optionalProperties: {
        device_name: { type: "string" },
        module_name: { type: "string" }
      },
      additionalProperties: true // Open–closed principle
    },
    aggregated_reading: {
      properties: {
        device_id: { type: "string" },
        started_on: { type: "float64" },
        finished_on: { type: "float64" },
        module_type: { enum: Object.values(ModuleType) },
        module_id: { type: "string" },
        metric_type: { enum: Object.values(MetricType) },
        first_value: { type: "float64" },
        last_value: { type: "float64" },
        min_value: { type: "float64" },
        max_value: { type: "float64" },
        mean_value: { type: "float64" },
        median_value: { type: "float64" },
        readings_no: { type: "float64" }
      },
      optionalProperties: {
        device_name: { type: "string" },
        module_name: { type: "string" }
      },
      additionalProperties: true // Open–closed principle
    }
  }
}

const eventParser = ajv.compileParser<RawEvent>(actionSchema)
const eventSerializer = ajv.compileSerializer<RawEvent>(actionSchema)

export type LiveReadingEvent = {
  eventType: EventType.LiveReading
  deviceId: string
  deviceName?: string
  createdOn: Date
  moduleType: ModuleType
  moduleId: string
  moduleName?: string
  metricType: MetricType
  metricValue: number
}

export type AggregatedReadingEvent = {
  eventType: EventType.AggregatedReading
  deviceId: string
  deviceName?: string
  startedOn: Date
  finishedOn: Date
  moduleType: ModuleType
  moduleId: string
  moduleName?: string
  metric_type: MetricType
  firstValue: number
  lastValue: number
  minValue: number
  maxValue: number
  meanValue: number
  medianValue: number
  readingsNo: number
}

export type Event = LiveReadingEvent | AggregatedReadingEvent

export const parseEvent = (rawEvent: string): Event | undefined => {
  const event = eventParser(rawEvent)
  if (!event) return
  switch (event.event_type) {
    case EventType.LiveReading:
      return {
        eventType: event.event_type,
        deviceId: event.device_id,
        deviceName: event.device_name,
        createdOn: new Date(event.created_on),
        moduleType: event.module_type,
        moduleId: event.module_id,
        moduleName: event.module_name,
        metricType: event.metric_type,
        metricValue: event.metric_value
      }
    case EventType.AggregatedReading:
      return {
        eventType: event.event_type,
        deviceId: event.device_id,
        deviceName: event.device_name,
        startedOn: new Date(event.started_on),
        finishedOn: new Date(event.finished_on),
        moduleType: event.module_type,
        moduleId: event.module_id,
        moduleName: event.module_name,
        metric_type: event.metric_type,
        firstValue: event.first_value,
        lastValue: event.last_value,
        minValue: event.min_value,
        maxValue: event.max_value,
        meanValue: event.mean_value,
        medianValue: event.median_value,
        readingsNo: event.readings_no
      }
  }
}

export const serializeEvent = (event: Event): string => {
  switch (event.eventType) {
    case EventType.LiveReading:
      return eventSerializer({
        event_type: event.eventType,
        device_id: event.deviceId,
        device_name: event.deviceName,
        created_on: event.createdOn.getTime(),
        module_type: event.moduleType,
        module_id: event.moduleId,
        module_name: event.moduleName,
        metric_type: event.metricType,
        metric_value: event.metricValue
      })
    case EventType.AggregatedReading:
      return eventSerializer({
        event_type: event.eventType,
        device_id: event.deviceId,
        device_name: event.deviceName,
        started_on: event.startedOn.getTime(),
        finished_on: event.finishedOn.getTime(),
        module_type: event.moduleType,
        module_id: event.moduleId,
        module_name: event.moduleName,
        metric_type: event.metric_type,
        first_value: event.firstValue,
        last_value: event.lastValue,
        min_value: event.minValue,
        max_value: event.maxValue,
        mean_value: event.meanValue,
        median_value: event.medianValue,
        readings_no: event.readingsNo
      })
  }
}
