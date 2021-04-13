import React, { ReactElement } from "react"
import "antd/dist/antd.css"
import Metrics from "./Metrics"

// const lookUp: Record<string, string> = {
//   d1babde1b9b4b22b1d90f07b2a95180d: "LON",
//   "364cb313d02c9120c1d8efe788a36245": "KTW"
// }

const App = (): ReactElement => {
  return (
    <div className="App">
      {/*<p>{state.theme.theme}</p>*/}
      {/*<button onClick={() => dispatch({ type: "TOGGLE_THEME" })}>d</button>*/}
      <Metrics />
    </div>
  )
}

export default App
