import * as faker from "faker"
import { ActionType, PongAction } from "../../types/actions"

export default (o: Partial<PongAction> = {}): PongAction => ({
  action: ActionType.Pong,
  server_time: faker.time.recent("unix"),
  ...o
})
