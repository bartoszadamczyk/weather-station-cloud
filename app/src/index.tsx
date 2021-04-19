import React from "react"
import ReactDOM from "react-dom"
import * as Sentry from "@sentry/react"
import { Integrations } from "@sentry/tracing"
import { Config, Environment } from "./helpers/config"
import AppData from "./components/AppData"
import reportWebVitals from "./reportWebVitals"

if (Config.NodeEnv !== Environment.Development && Config.SentryDsn) {
  Sentry.init({
    dsn: Config.SentryDsn,
    environment: Config.NodeEnv,
    integrations: [new Integrations.BrowserTracing()]
  })
}

ReactDOM.render(
  <React.StrictMode>
    <AppData />
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
