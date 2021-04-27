import { useEffect, useRef, useState } from "react"
import { WebSocketWithHeartbeat } from "../utils/websocket/webSocketWithHeartbeat"

export const useWebSocketWithHeartbeat = (
  url: string,
  onMessage?: (messageEvent: MessageEvent) => void,
  reconnectDelay?: number,
  pingDelay?: number,
  pongTimeout?: number
): {
  isConnected: boolean
  isReconnecting: boolean
  isClosed: boolean
  send: (msg: string) => void
  close: () => void
  open: () => void
} => {
  const ws = useRef<WebSocketWithHeartbeat>()

  const [isConnected, setConnected] = useState(false)
  const [isReconnecting, setReconnecting] = useState(false)
  const [isClosed, setClosed] = useState(false)

  useEffect(() => {
    ws.current = new WebSocketWithHeartbeat(url, reconnectDelay, pingDelay, pongTimeout)
    ws.current.onOpen = () => {
      setConnected(true)
      setReconnecting(false)
    }

    ws.current.onClose = () => {
      setConnected(false)
    }

    ws.current.onError = () => {
      setConnected(false)
    }

    ws.current.onReconnect = () => {
      setConnected(false)
      setReconnecting(true)
    }

    ws.current.onMessage = (messageEvent: MessageEvent) => {
      if (!onMessage) return
      onMessage(messageEvent)
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
      setConnected(false)
      setReconnecting(false)
    }
  }, [url, onMessage, reconnectDelay, pingDelay, pongTimeout])

  const send = (msg: string): void => {
    if (ws.current) {
      ws.current.send(msg)
    }
  }
  const close = () => {
    if (ws.current) {
      ws.current.close()
    }
    setConnected(false)
    setReconnecting(false)
    setClosed(true)
  }

  const open = () => {
    setClosed(false)
    if (ws.current) {
      ws.current.open()
    }
  }

  return { isConnected, isReconnecting, isClosed, send, close, open }
}
