import * as faker from "faker"
import { ActionType, LiveReadingAction, MetricType, ModuleType } from "../../types/actions"

export default (o: Partial<LiveReadingAction> = {}): LiveReadingAction => ({
  action: ActionType.LiveReading,
  device_id: faker.datatype.string(),
  created_on: faker.time.recent("unix"),
  module_type: faker.random.arrayElement(Object.values(ModuleType)),
  module_id: faker.datatype.string(),
  metric_type: faker.random.arrayElement(Object.values(MetricType)),
  metric_value: faker.datatype.number(),
  ...o
})
