import * as faker from "faker"
import { EventType, LiveReadingRawEvent, MetricType, ModuleType } from "../../types/event"

export default (o: Partial<LiveReadingRawEvent> = {}): LiveReadingRawEvent => ({
  event_type: EventType.LiveReading,
  device_id: faker.datatype.string(),
  created_on: faker.time.recent("unix"),
  module_type: faker.random.arrayElement(Object.values(ModuleType)),
  module_id: faker.datatype.string(),
  metric_type: faker.random.arrayElement(Object.values(MetricType)),
  metric_value: faker.datatype.number(),
  ...o
})
