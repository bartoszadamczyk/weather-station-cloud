import { LiveReadingAction } from "./types/actions"
import { getMappingRecord } from "./mappings"

export const enrichLiveReadingAction = async (action: LiveReadingAction): Promise<LiveReadingAction> => {
  const deviceMapping = await getMappingRecord(action.device_id)
  const moduleMapping = await getMappingRecord(action.device_id, action.module_id)
  return {
    ...action,
    device_name: deviceMapping ? deviceMapping.name : undefined,
    module_name: moduleMapping ? moduleMapping.name : undefined
  }
}
