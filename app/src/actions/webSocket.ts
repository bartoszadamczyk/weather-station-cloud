import { WebSocketStateUpdateAction } from "../reducers/webSocket"

export const updateWebSocketState = (
  isConnected: boolean,
  isReconnecting: boolean,
  isClosed: boolean
): WebSocketStateUpdateAction => ({
  type: "WEB_SOCKET_STATE_UPDATE",
  isConnected,
  isReconnecting,
  isClosed
})
