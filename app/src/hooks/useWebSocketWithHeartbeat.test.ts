import { renderHook, act } from "@testing-library/react-hooks"
import WS from "jest-websocket-mock"
import { useWebSocketWithHeartbeat } from "./useWebSocketWithHeartbeat"

const WS_URL = "ws://localhost:1234"

describe("Test useWebSocketWithHeartbeat hook", () => {
  let server: WS

  afterEach(() => {
    WS.clean()
  })

  let defaultOnMessage = () => {}
  const hookInit = (onMessage: (messageEvent: MessageEvent) => void = defaultOnMessage) =>
    useWebSocketWithHeartbeat(WS_URL, onMessage, 1, 1, 1)
  const initServer = (): WS => {
    return new WS(WS_URL)
  }
  const restartServer = (): WS => {
    WS.clean()
    return initServer()
  }

  test("Test it connects to server", async () => {
    server = initServer()
    const { result } = renderHook(hookInit)

    await server.connected
    expect(result.current.isConnected).toBeTruthy()
    expect(result.current.isReconnecting).toBeFalsy()
    expect(result.current.isClosed).toBeFalsy()
  })

  test("Test it connects to server starting offline", async () => {
    server = initServer()
    server.close()
    await server.closed

    const { result, waitForNextUpdate } = renderHook(hookInit)
    await waitForNextUpdate()
    expect(result.current.isConnected).toBeFalsy()
    expect(result.current.isReconnecting).toBeTruthy()
    expect(result.current.isClosed).toBeFalsy()

    server = restartServer()
    await server.connected

    expect(result.current.isConnected).toBeTruthy()
    expect(result.current.isReconnecting).toBeFalsy()
    expect(result.current.isClosed).toBeFalsy()
  })

  test("Test it handles server closed", async () => {
    server = initServer()
    const { result } = renderHook(hookInit)
    await server.connected
    expect(result.current.isConnected).toBeTruthy()
    expect(result.current.isReconnecting).toBeFalsy()
    expect(result.current.isClosed).toBeFalsy()

    server.close()
    await server.closed

    expect(result.current.isConnected).toBeFalsy()
    expect(result.current.isReconnecting).toBeTruthy()
    expect(result.current.isClosed).toBeFalsy()

    server = restartServer()
    await server.connected

    expect(result.current.isConnected).toBeTruthy()
    expect(result.current.isReconnecting).toBeFalsy()
    expect(result.current.isClosed).toBeFalsy()
  })

  test("Test it handles server error", async () => {
    server = initServer()
    const { result } = renderHook(hookInit)
    await server.connected
    expect(result.current.isConnected).toBeTruthy()
    expect(result.current.isReconnecting).toBeFalsy()
    expect(result.current.isClosed).toBeFalsy()

    server.error()
    await server.closed

    expect(result.current.isConnected).toBeFalsy()
    expect(result.current.isReconnecting).toBeTruthy()
    expect(result.current.isClosed).toBeFalsy()

    server = restartServer()
    await server.connected

    expect(result.current.isConnected).toBeTruthy()
    expect(result.current.isReconnecting).toBeFalsy()
    expect(result.current.isClosed).toBeFalsy()
  })

  test("Test it handles manual close and open", async () => {
    server = initServer()
    const { result } = renderHook(hookInit)
    await server.connected
    expect(result.current.isConnected).toBeTruthy()
    expect(result.current.isReconnecting).toBeFalsy()
    expect(result.current.isClosed).toBeFalsy()

    act(() => {
      result.current.close()
    })
    await server.closed
    expect(result.current.isConnected).toBeFalsy()
    expect(result.current.isReconnecting).toBeFalsy()
    expect(result.current.isClosed).toBeTruthy()

    server = restartServer()
    act(() => {
      result.current.open()
    })
    await server.connected
    expect(result.current.isConnected).toBeTruthy()
    expect(result.current.isReconnecting).toBeFalsy()
    expect(result.current.isClosed).toBeFalsy()
  })

  test("Test it handles msg from server", async () => {
    server = initServer()
    const onMessage = jest.fn()
    const { result } = renderHook(() => hookInit(onMessage))
    await server.connected

    expect(result.current.isConnected).toBeTruthy()
    expect(result.current.isReconnecting).toBeFalsy()
    expect(result.current.isClosed).toBeFalsy()

    server.send("hello")
    expect(onMessage).toBeCalledWith(expect.objectContaining({ data: "hello" }))
  })

  test("Test it handles msg from client", async () => {
    server = initServer()
    const { result } = renderHook(hookInit)
    await server.connected
    expect(result.current.isConnected).toBeTruthy()
    expect(result.current.isReconnecting).toBeFalsy()
    expect(result.current.isClosed).toBeFalsy()

    await act(async () => {
      result.current.send("hello")
      await expect(server).toReceiveMessage("hello")
    })
  })
})
