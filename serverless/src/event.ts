import { EventType, LiveReadingEvent, parseEvent, serializeEvent } from "./types/event"
import { getMappingRecord } from "./mapping"
import { sendToClients } from "./client"
import { ConnectionRecord } from "./types/connection"

export const enrichLiveReadingEvent = async (action: LiveReadingEvent): Promise<LiveReadingEvent> => {
  const deviceMapping = await getMappingRecord(action.deviceId)
  const moduleMapping = await getMappingRecord(action.deviceId, action.moduleId)
  return {
    ...action,
    deviceName: deviceMapping ? deviceMapping.name : undefined,
    moduleName: moduleMapping ? moduleMapping.name : undefined
  }
}

export const handleEvent = async (
  connections: Array<ConnectionRecord> | undefined,
  body: string
): Promise<Array<ConnectionRecord> | undefined> => {
  const event = parseEvent(body)
  if (!event) return connections
  switch (event.eventType) {
    case EventType.LiveReading:
      return await sendToClients(connections, serializeEvent(await enrichLiveReadingEvent(event)))
  }
  return connections
}
