import React, { createContext, ReactElement, useCallback, useContext, useEffect, useMemo } from "react"

import { useWebSocketWithHeartbeat } from "../hooks/useWebSocketWithHeartbeat"
import { AppContext } from "./AppContext"
import { ActionSchemaType, actionParser, actionSerializer, ActionType } from "../types/actions"
import { Actions } from "../reducers"

export const WebSocketContext = createContext<{
  sendAction: (sendMessage: ActionSchemaType) => void
  close: () => void
  open: () => void
}>({
  sendAction: () => undefined,
  close: () => undefined,
  open: () => undefined
})

const URL = "wss://7b7bmiapid.execute-api.eu-central-1.amazonaws.com/prod"

const dispatchWebSocketAction = (dispatch: React.Dispatch<Actions>, action: ActionSchemaType) => {
  switch (action.action) {
    case ActionType.LiveReading:
      dispatch({
        type: "NEW_LIVE_METRIC",
        ...action
      })
      break
  }
}

export const WebSocketProvider = ({ children }: { children: React.ReactNode }): ReactElement => {
  const { dispatch } = useContext(AppContext)

  const onMessage = useCallback(
    (messageEvent: MessageEvent) => {
      if (!messageEvent.data) return
      const action = actionParser(messageEvent.data)
      if (!action) return
      dispatchWebSocketAction(dispatch, action)
    },
    [dispatch]
  )

  const { isConnected, isReconnecting, isClosed, close, open, send } = useWebSocketWithHeartbeat(URL, onMessage)

  const sendAction = useCallback(
    (action: ActionSchemaType) => {
      send(actionSerializer(action))
    },
    [send]
  )

  useEffect(() => {
    dispatch({ type: "WEB_SOCKET_STATE_UPDATE", isConnected, isReconnecting, isClosed })
  }, [dispatch, isConnected, isReconnecting, isClosed])

  const contextValue = useMemo(() => {
    return { close, open, sendAction }
  }, [close, open, sendAction])

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>
}
