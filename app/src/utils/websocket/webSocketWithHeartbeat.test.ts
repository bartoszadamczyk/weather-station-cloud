import { WebSocketMissingConnectionError, WebSocketWithHeartbeat } from "./webSocketWithHeartbeat"
import WS from "jest-websocket-mock"

const WS_URL = "ws://localhost:1234"

describe("Test WebSocketWithHeartbeat", () => {
  let server: WS
  let client: WebSocketWithHeartbeat

  afterEach(() => {
    jest.useRealTimers()
    client.close()
    WS.clean()
  })

  const initServerAndClient = async (): Promise<[WS, WebSocketWithHeartbeat]> => {
    const server = new WS(WS_URL)
    const client = new WebSocketWithHeartbeat(WS_URL, 100, 100, 100)
    await server.connected
    return [server, client]
  }

  const restartServer = (): WS => {
    WS.clean()
    return new WS(WS_URL)
  }

  describe("Test basic behaviour", () => {
    test("Test it connects to server", async () => {
      ;[server, client] = await initServerAndClient()

      expect(client.getReadyState()).toBe(WebSocket.OPEN)

      client.send("hello server")
      await expect(server).toReceiveMessage("hello server")

      client.onMessage = jest.fn()
      server.send("hello client")
      await expect(client.onMessage).toBeCalledWith(expect.objectContaining({ data: "hello client" }))
    })

    test("Test close() and open() works", async () => {
      ;[server, client] = await initServerAndClient()

      client.onClose = jest.fn()
      client.close()
      await server.closed
      await expect(client.onClose).not.toBeCalled()
      expect(client.getReadyState()).toBe(WebSocket.CLOSED)

      server = restartServer()

      client.onOpen = jest.fn()
      client.open()
      await server.connected
      await expect(client.onOpen).toBeCalled()
      expect(client.getReadyState()).toBe(WebSocket.OPEN)
    })

    test("Test onClose() works", async () => {
      ;[server, client] = await initServerAndClient()
      client.onClose = jest.fn()
      server.close()
      await expect(client.onClose).toBeCalled()
    })

    test("Test onError() works", async () => {
      ;[server, client] = await initServerAndClient()
      client.onError = jest.fn()
      server.error()
      await expect(client.onError).toBeCalled()
    })

    test("Test close() works", async () => {
      ;[server, client] = await initServerAndClient()
      client.stopReconnecting = jest.fn()
      client.stopHeartbeat = jest.fn()
      client.close()

      await expect(client.stopReconnecting).toBeCalled()
      await expect(client.stopHeartbeat).toBeCalled()
      expect(client.ws).not.toBeDefined()
      await server.closed
    })
  })

  describe("Test messages behaviour", () => {
    test("Test send filters out pong msg", async () => {
      ;[server, client] = await initServerAndClient()
      client.onMessage = jest.fn()
      server.send(JSON.stringify({ action: "pong" }))
      await expect(client.onMessage).not.toBeCalled()
    })

    test("Test send throws when socket is closed", async () => {
      ;[server, client] = await initServerAndClient()
      client.close()
      expect(() => {
        client.send(JSON.stringify("hello"))
      }).toThrowError(WebSocketMissingConnectionError)
    })

    test("Test send throws when socket has just closed from the server side", async () => {
      ;[server, client] = await initServerAndClient()
      client.getReadyState = jest.fn().mockReturnValue(WebSocket.CLOSED)
      expect(client.getReadyState()).toBe(WebSocket.CLOSED)
      expect(() => {
        client.send(JSON.stringify("hello"))
      }).toThrowError(WebSocketMissingConnectionError)
    })
  })

  describe("Test getReadyState() behaviour", () => {
    test("Test getReadyState() works for connecting and open", async () => {
      server = new WS(WS_URL)
      client = new WebSocketWithHeartbeat(WS_URL)

      expect(client.getReadyState()).toBe(WebSocket.CONNECTING)

      await server.connected
      expect(client.getReadyState()).toBe(WebSocket.OPEN)
    })

    test("Test getReadyState() works for closing and closed", async () => {
      server = new WS(WS_URL)
      server.on("connection", (socket) => {
        socket.close()
      })
      client = new WebSocketWithHeartbeat(WS_URL)

      expect(client.getReadyState()).toBe(WebSocket.CONNECTING)

      await server.connected
      expect(client.getReadyState()).toBe(WebSocket.CLOSING)

      await server.closed
      expect(client.getReadyState()).toBe(WebSocket.CLOSED)
    })

    test("Test getReadyState() works when closed manually", async () => {
      ;[server, client] = await initServerAndClient()
      client.close()
      expect(client.ws).not.toBeDefined()
      expect(client.getReadyState()).toBe(WebSocket.CLOSED)
    })
  })

  describe("Test reconnect logic", () => {
    test("Test reconnect() is called on socket closed", async () => {
      ;[server, client] = await initServerAndClient()
      client.reconnect = jest.fn()
      server.close()
      await expect(client.reconnect).toBeCalled()
    })

    test("Test reconnect() is called on socket error", async () => {
      ;[server, client] = await initServerAndClient()
      client.reconnect = jest.fn()
      server.error()
      await expect(client.reconnect).toBeCalled()
    })

    test("Test close() blocks reconnect()", async () => {
      ;[server, client] = await initServerAndClient()
      client.onReconnect = jest.fn()
      client.close()
      client.reconnect()
      await expect(client.onReconnect).not.toBeCalled()
    })

    test("Test reconnect() blocks reconnect()", async () => {
      ;[server, client] = await initServerAndClient()
      client.onReconnect = jest.fn()
      client.reconnect()
      client.reconnect()
      await expect(client.onReconnect).toBeCalledTimes(1)
      client.stopReconnecting()
    })

    test("Test reconnect() creates new connection", async () => {
      ;[server, client] = await initServerAndClient()

      client.onReconnect = jest.fn()
      client.createWebSocket = jest.fn()

      jest.useFakeTimers()
      client.reconnect()
      await expect(client.onReconnect).toBeCalled()

      jest.advanceTimersByTime(1000)
      await expect(client.createWebSocket).toBeCalled()
      expect(client.isReconnecting()).toBeFalsy()
    })

    test("Test stopReconnecting() works", async () => {
      ;[server, client] = await initServerAndClient()

      client.killWebSocket = jest.fn()
      client.onReconnect = jest.fn()
      client.createWebSocket = jest.fn()

      jest.useFakeTimers()
      client.reconnect()
      await expect(client.killWebSocket).toBeCalled()
      await expect(client.onReconnect).toBeCalled()

      client.stopReconnecting()
      expect(client.isReconnecting()).toBeFalsy()

      jest.advanceTimersByTime(1000)
      await expect(client.createWebSocket).not.toBeCalled()
      expect(client.isReconnecting()).toBeFalsy()
    })
  })

  describe("Test heartbeat logic", () => {
    test("Test restartHeartbeat() stops and starts heartbeat", async () => {
      ;[server, client] = await initServerAndClient()
      client.stopHeartbeat = jest.fn()
      client.startHeartbeat = jest.fn()
      client.restartHeartbeat()
      await expect(client.stopHeartbeat).toBeCalled()
      await expect(client.startHeartbeat).toBeCalled()
    })

    test("Test restartHeartbeat() is called on socket open", async () => {
      ;[server, client] = await initServerAndClient()
      client.close()
      await server.closed

      server = restartServer()

      client.restartHeartbeat = jest.fn()
      client.open()
      await server.connected
      await expect(client.restartHeartbeat).toBeCalled()
    })

    test("Test restartHeartbeat() is called on message", async () => {
      ;[server, client] = await initServerAndClient()
      client.restartHeartbeat = jest.fn()
      server.send("hello")
      await expect(client.restartHeartbeat).toBeCalled()
    })

    test("Test startHeartbeat() checks connection", async () => {
      ;[server, client] = await initServerAndClient()

      client.reconnect = jest.fn()
      client.getReadyState = jest.fn().mockReturnValue(WebSocket.CLOSED)

      jest.useFakeTimers()
      client.restartHeartbeat()
      jest.advanceTimersByTime(1000)
      await expect(client.reconnect).toBeCalled()
    })

    test("Test startHeartbeat() sends ping and reconnects on missing pong", async () => {
      ;[server, client] = await initServerAndClient()

      client.reconnect = jest.fn()
      client.send = jest.fn()

      jest.useFakeTimers()
      client.restartHeartbeat()
      jest.advanceTimersByTime(100)
      await expect(client.send).toBeCalled()
      jest.advanceTimersByTime(100)
      await expect(client.reconnect).toBeCalled()
    })
  })
})
