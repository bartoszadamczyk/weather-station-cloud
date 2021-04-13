import { Actions } from "./index"

export type WebSocketState = {
  isConnected: boolean
  isReconnecting: boolean
  isClosed: boolean
}

export const webSocketInitialState: WebSocketState = {
  isConnected: false,
  isReconnecting: false,
  isClosed: false
}

type WebSocketStateUpdateAction = {
  type: "WEB_SOCKET_STATE_UPDATE"
  isConnected: boolean
  isReconnecting: boolean
  isClosed: boolean
}
export type WebSocketAction = WebSocketStateUpdateAction

export const webSocketReducer = (draft: WebSocketState, action: Actions): void => {
  switch (action.type) {
    case "WEB_SOCKET_STATE_UPDATE":
      draft.isConnected = action.isConnected
      draft.isReconnecting = action.isReconnecting
      draft.isClosed = action.isClosed
      break
  }
}
