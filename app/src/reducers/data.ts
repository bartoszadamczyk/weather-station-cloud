import { sortBy } from "../helpers/misc"
import { Actions } from "./index"
import { ModuleType, LiveReadingAction, MetricType } from "../types/actions"

export type ReadingRecord = {
  createdOn: Date
  metric_value: number
}

export type MetricRecord = {
  id: string
  deviceId: string
  deviceName?: string
  moduleType: ModuleType
  moduleId: string
  moduleName?: string
  metricType: MetricType
  liveReadings: Array<ReadingRecord>
  recentValue: number
}

export type DataState = {
  live: Array<MetricRecord>
  devices: Record<string, { name?: string }>
}

export const dataInitialState: DataState = {
  live: [],
  devices: {}
}

type NewLiveMetricAction = {
  type: "NEW_LIVE_METRIC"
} & LiveReadingAction

export type DataActions = NewLiveMetricAction

const metricId = ({
  device_id,
  module_id,
  metric_type
}: {
  device_id: string
  module_id: string
  metric_type: MetricType
}) => {
  return `${device_id}_${module_id}_${metric_type}`
}

export const dataReducer = (draft: DataState, action: Actions): void => {
  switch (action.type) {
    case "NEW_LIVE_METRIC":
      ;(() => {
        if (action.module_type === ModuleType.Relay) return

        if (draft.devices[action.device_id]) {
          draft.devices[action.device_id].name = action.device_name
        } else {
          draft.devices[action.device_id] = { name: action.device_name }
        }

        const id = metricId(action)
        const metric = draft.live.find((m) => m.id === id)
        const reading = {
          createdOn: new Date(action.created_on),
          metric_value: action.metric_value
        }
        if (metric) {
          metric.liveReadings.push(reading)
          metric.liveReadings = metric.liveReadings.slice(-50)
          metric.liveReadings = sortBy(metric.liveReadings, "createdOn")
          metric.recentValue = metric.liveReadings[metric.liveReadings.length - 1].metric_value
        } else {
          draft.live.push({
            id,
            deviceId: action.device_id,
            deviceName: action.device_name,
            moduleType: action.module_type,
            moduleId: action.module_id,
            moduleName: action.module_name,
            metricType: action.metric_type,
            recentValue: reading.metric_value,
            liveReadings: [reading]
          })
          draft.live = sortBy(draft.live, "id")
        }
      })()
      break
  }
}
