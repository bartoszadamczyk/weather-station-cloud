import React, { ReactElement, useContext } from "react"

import "./App.css"
import { AppContext } from "../context/AppContext"

// const lookUp: Record<string, string> = {
//   d1babde1b9b4b22b1d90f07b2a95180d: "LON",
//   "364cb313d02c9120c1d8efe788a36245": "KTW"
// }

const App = (): ReactElement => {
  // const [readings, setReadings] = useImmer<Record<string, Reading>>({})
  // const [latest, setLatest] = useState<string>()
  // const onMessage = useCallback(
  //   (messageEvent: MessageEvent) => {
  //     if (!messageEvent.data) return
  //     try {
  //       const event = JSON.parse(messageEvent.data) as Reading
  //       const id = `${event.device_uuid}_${event.sensor_id}`
  //       setLatest(id)
  //       setReadings((readings) => {
  //         readings[id] = event
  //       })
  //     } catch {
  //       console.log("Failed to parse the message")
  //     }
  //   },
  //   [setReadings]
  // )
  // const { isConnected, isReconnecting, isClosed, close, open } = useWebSocketWithHeartbeat(URL)
  const { state, dispatch } = useContext(AppContext)
  return (
    <div className="App">
      <p>{state.theme.theme}</p>
      <button onClick={() => dispatch({ type: "TOGGLE_THEME" })}>d</button>
      {/*{Object.keys(readings).map((id) => (*/}
      {/*  <p key={id}>*/}
      {/*    {lookUp[readings[id].device_uuid]} {readings[id].sensor_model} {readings[id].temperature}{" "}*/}
      {/*    {id == latest && "<"}*/}
      {/*  </p>*/}
      {/*))}*/}
      {/*<p>isConnected {isConnected ? "True" : "False"}</p>*/}
      {/*<p>isReconnecting {isReconnecting ? "True" : "False"}</p>*/}
      {/*<p>isClosed {isClosed ? "True" : "False"}</p>*/}
      {/*<button onClick={() => close()}>close</button>*/}
      {/*<button onClick={() => close()}>close</button>*/}
      {/*<button onClick={() => open()}>open</button>*/}
    </div>
  )
}

export default App
