export class WebSocketMissingConnectionError extends Error {
  constructor(m = "WebSocketMissingConnection") {
    super(m)
    Object.setPrototypeOf(this, WebSocketMissingConnectionError.prototype)
  }
}

export class WebSocketWithHeartbeat {
  url: string
  ws?: WebSocket

  private readonly reconnectDelay: number
  private readonly pingDelay: number
  private readonly pongTimeout: number
  private readonly pingMsg: string
  private readonly pongMsg: string

  private blockReconnect = false

  private reconnectDelayTimeoutId?: number = undefined
  private pingDelayTimeoutId?: number = undefined
  private pongTimeoutId?: number = undefined

  onClose: (closeEvent: CloseEvent) => void = () => undefined
  onError: (event: Event) => void = () => undefined
  onOpen: (event: Event) => void = () => undefined
  onMessage: (messageEvent: MessageEvent) => void = () => undefined
  onReconnect: () => void = () => undefined

  constructor(
    url: string,
    reconnectDelay = 3000,
    pingDelay = 5000,
    pongTimeout = 2000,
    pingMsg = JSON.stringify({ action: "ping" }),
    pongMsg = JSON.stringify({ action: "pong" })
  ) {
    this.url = url
    this.reconnectDelay = reconnectDelay
    this.pingDelay = pingDelay
    this.pongTimeout = pongTimeout
    this.pingMsg = pingMsg
    this.pongMsg = pongMsg
    this.createWebSocket()
  }

  createWebSocket(): void {
    if (this.ws) return
    this.ws = new WebSocket(this.url)

    this.ws.onclose = (closeEvent) => {
      this.onClose(closeEvent)
      this.reconnect()
    }
    this.ws.onerror = (event) => {
      this.onError(event)
      this.reconnect()
    }
    this.ws.onopen = (event) => {
      this.onOpen(event)
      this.restartHeartbeat()
    }
    this.ws.onmessage = (messageEvent) => {
      if (messageEvent.data !== this.pongMsg) {
        this.onMessage(messageEvent)
      }
      this.restartHeartbeat()
    }
  }

  getReadyState(): number {
    if (this.ws) {
      return this.ws.readyState
    }
    return WebSocket.CLOSED
  }

  startHeartbeat(): void {
    this.pingDelayTimeoutId = window.setTimeout(() => {
      if (this.getReadyState() > 1) {
        this.reconnect()
      } else {
        this.send(this.pingMsg)
        this.pongTimeoutId = window.setTimeout(() => {
          this.reconnect()
        }, this.pongTimeout)
      }
    }, this.pingDelay)
  }

  stopHeartbeat(): void {
    clearTimeout(this.pingDelayTimeoutId)
    clearTimeout(this.pongTimeoutId)
  }

  restartHeartbeat(): void {
    this.stopHeartbeat()
    this.startHeartbeat()
  }

  reconnect(): void {
    if (this.blockReconnect || this.reconnectDelayTimeoutId) return
    this.killWebSocket()
    this.onReconnect()
    this.reconnectDelayTimeoutId = window.setTimeout(() => {
      this.createWebSocket()
      delete this.reconnectDelayTimeoutId
    }, this.reconnectDelay)
  }

  isReconnecting(): boolean {
    return !!this.reconnectDelayTimeoutId
  }

  stopReconnecting(): void {
    if (this.reconnectDelayTimeoutId) {
      clearTimeout(this.reconnectDelayTimeoutId)
      delete this.reconnectDelayTimeoutId
    }
  }

  send(data: string | ArrayBuffer | Blob | ArrayBufferView): void {
    // WebSocket.CONNECTING	0
    // WebSocket.OPEN	1
    // WebSocket.CLOSING	2
    // WebSocket.CLOSED	3
    if (!this.ws || this.getReadyState() > 1) {
      throw new WebSocketMissingConnectionError()
    }
    this.ws.send(data)
  }

  close(): void {
    this.blockReconnect = true
    this.stopReconnecting()
    this.killWebSocket()
  }

  killWebSocket(): void {
    this.stopHeartbeat()
    if (this.ws) {
      this.ws.close()
      this.ws.onclose = () => undefined
      this.ws.onerror = () => undefined
      this.ws.onopen = () => undefined
      this.ws.onmessage = () => undefined
      delete this.ws
    }
  }

  open(): void {
    this.blockReconnect = false
    this.createWebSocket()
  }
}
