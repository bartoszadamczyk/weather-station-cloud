import * as faker from "faker"
import { EventType, LiveReadingEvent, MetricType, ModuleType } from "../../types/event"

export default (o: Partial<LiveReadingEvent> = {}): LiveReadingEvent => ({
  eventType: EventType.LiveReading,
  deviceId: faker.datatype.string(),
  createdOn: faker.time.recent("unix"),
  moduleType: faker.random.arrayElement(Object.values(ModuleType)),
  moduleId: faker.datatype.string(),
  metricType: faker.random.arrayElement(Object.values(MetricType)),
  metricValue: faker.datatype.number(),
  ...o
})
