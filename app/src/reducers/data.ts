import { findById, getKey, getLastValue, getLastValues, sortBy } from "../utils/helpers"
import { Actions } from "./index"
import { ModuleType, MetricType, LiveReadingEvent } from "../types/event"

export type RecentValue = {
  createdOn: Date
  metricValue: number
}

export type Metric = {
  metricId: string
  deviceId: string
  deviceName?: string
  createdOn: Date
  moduleType: ModuleType
  moduleId: string
  moduleName?: string
  metricType: MetricType
  metricValue: number
  recentValues: Array<RecentValue>
}

export type DataState = {
  metrics: Array<Metric>
}

export const dataInitialState: DataState = {
  metrics: []
}

export type NewLiveMetricAction = {
  type: "NEW_LIVE_METRIC"
} & LiveReadingEvent

export type DataActions = NewLiveMetricAction

export const handleNewLiveMetric = (draft: DataState, action: NewLiveMetricAction): void => {
  const { createdOn, metricValue } = action
  const reading = { createdOn, metricValue }
  const metricId = getKey(action, ["deviceId", "moduleId", "metricType"])
  const metric = findById(draft.metrics, metricId, "metricId")
  if (metric) {
    metric.recentValues = sortBy(getLastValues(metric.recentValues.concat(reading), 50), "createdOn")
    metric.metricValue = getLastValue(metric.recentValues).metricValue
  } else {
    const { type, ...metric } = action
    draft.metrics.push({ metricId, ...metric, recentValues: [reading] })
    draft.metrics = sortBy(draft.metrics, "metricId")
  }
}

export const dataReducer = (draft: DataState, action: Actions): void => {
  switch (action.type) {
    case "NEW_LIVE_METRIC":
      return handleNewLiveMetric(draft, action)
  }
}
