import { NewLiveMetricAction } from "../reducers/data"
import { LiveReadingEvent } from "../../../serverless/src/types/event"

export const createNewLiveMetric = (liveReadingEvent: LiveReadingEvent): NewLiveMetricAction => ({
  type: "NEW_LIVE_METRIC",
  ...liveReadingEvent
})
