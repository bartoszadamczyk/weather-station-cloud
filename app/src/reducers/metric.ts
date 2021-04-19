import { sortBy } from "../helpers/misc"
import { Actions } from "./index"
import { ModuleType, LiveReadingAction, MetricType } from "../types/actions"

export type ReadingRecord = {
  createdOn: Date
  value: number
}

export type MetricRecord = {
  id: string
  deviceId: string
  deviceName?: string
  moduleType: ModuleType
  moduleId: string
  moduleName?: string
  metric: MetricType
  liveReadings: Array<ReadingRecord>
  recentValue: number
}

export type MetricState = {
  metrics: Array<MetricRecord>
  devices: Record<string, { name?: string }>
}

export const metricInitialState: MetricState = {
  metrics: [],
  devices: {}
}

type NewLiveMetricAction = {
  type: "NEW_LIVE_METRIC"
} & LiveReadingAction

export type MetricAction = NewLiveMetricAction

const metricId = ({ device_id, module_id, metric }: { device_id: string; module_id: string; metric: MetricType }) => {
  return `${device_id}_${module_id}_${metric}`
}

export const metricReducer = (draft: MetricState, action: Actions): void => {
  switch (action.type) {
    case "NEW_LIVE_METRIC":
      ;(() => {
        if (action.module_type === ModuleType.Relay) return
        const id = metricId(action)
        const metric = draft.metrics.find((m) => m.id === id)
        const reading = {
          createdOn: new Date(action.created_on),
          value: action.value
        }
        if (draft.devices[action.device_id]) {
          draft.devices[action.device_id].name = action.device_name
        } else {
          draft.devices[action.device_id] = { name: action.device_name }
        }
        if (metric) {
          metric.liveReadings.push(reading)
          metric.liveReadings = metric.liveReadings.slice(-50)
          metric.liveReadings = sortBy(metric.liveReadings, "createdOn")
          metric.recentValue = metric.liveReadings[metric.liveReadings.length - 1].value
        } else {
          draft.metrics.push({
            id,
            deviceId: action.device_id,
            deviceName: action.device_name,
            moduleType: action.module_type,
            moduleId: action.module_id,
            moduleName: action.module_name,
            metric: action.metric,
            recentValue: reading.value,
            liveReadings: [reading]
          })
          draft.metrics = sortBy(draft.metrics, "id")
        }
      })()
      break
  }
}
