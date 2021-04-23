import React, { createContext, ReactElement, useCallback, useContext, useEffect, useMemo } from "react"

import { useWebSocketWithHeartbeat } from "../hooks/useWebSocketWithHeartbeat"
import { AppContext } from "./AppContext"
import { Event, parseEvent, serializeEvent, EventType } from "../types/event"
import { Actions } from "../reducers"

export const WebSocketContext = createContext<{
  sendAction: (sendMessage: Event) => void
  close: () => void
  open: () => void
}>({
  sendAction: () => undefined,
  close: () => undefined,
  open: () => undefined
})

const dispatchWebSocketAction = (dispatch: React.Dispatch<Actions>, data: string) => {
  const event = parseEvent(data)
  if (!event) return
  const action = createWebSocketAction(event)
  if (!action) return
  dispatch(action)
}

const createWebSocketAction = (action: Event): Actions | undefined => {
  switch (action.eventType) {
    case EventType.LiveReading:
      return {
        type: "NEW_LIVE_METRIC",
        ...action
      }
  }
}

export const WebSocketProvider = ({
  webSocketUrl,
  children
}: {
  webSocketUrl: string
  children: React.ReactNode
}): ReactElement => {
  const { dispatch } = useContext(AppContext)

  const onMessage = useCallback(
    (messageEvent: MessageEvent) => {
      dispatchWebSocketAction(dispatch, messageEvent.data)
    },
    [dispatch]
  )

  const { isConnected, isReconnecting, isClosed, close, open, send } = useWebSocketWithHeartbeat(
    webSocketUrl,
    onMessage
  )

  const sendAction = useCallback(
    (action: Event) => {
      send(serializeEvent(action))
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
