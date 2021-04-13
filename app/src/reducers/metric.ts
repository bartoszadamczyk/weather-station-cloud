import { Actions } from "./index"
import { ComponentType, LiveReadingAction, MetricType } from "../types/actions"

export type ReadingRecord = {
  createdOn: Date
  value: number
}

export type MetricRecord = {
  id: string
  deviceId: string
  componentType: ComponentType
  componentId: string
  metric: MetricType
  liveReadings: Array<ReadingRecord>
  latestReading: ReadingRecord
}

export type MetricState = {
  metrics: Array<MetricRecord>
}

export const metricInitialState: MetricState = {
  metrics: []
}

type NewLiveMetricAction = {
  type: "NEW_LIVE_METRIC"
} & LiveReadingAction

export type MetricAction = NewLiveMetricAction

const metricId = ({
  device_id,
  component_id,
  metric
}: {
  device_id: string
  component_id: string
  metric: MetricType
}) => {
  return `${device_id}_${component_id}_${metric}`
}

export const metricReducer = (draft: MetricState, action: Actions): void => {
  switch (action.type) {
    case "NEW_LIVE_METRIC":
      ;(() => {
        if (action.component_type === ComponentType.Relay) return
        const id = metricId(action)
        const metric = draft.metrics.find((m) => m.id === id)
        const reading = {
          createdOn: new Date(action.created_on),
          value: action.value
        }
        if (metric) {
          metric.liveReadings.push(reading)
          metric.latestReading = reading
          metric.liveReadings = metric.liveReadings.slice(-50)
          metric.liveReadings = metric.liveReadings.sort((a, b) => (a.createdOn > b.createdOn ? 1 : -1))
        } else {
          draft.metrics.push({
            id,
            deviceId: action.device_id,
            componentType: action.component_type,
            componentId: action.component_id,
            metric: action.metric,
            liveReadings: [reading],
            latestReading: reading
          })
          draft.metrics.sort((a, b) => (a.id > b.id ? 1 : -1))
        }
      })()
      break
  }
}
