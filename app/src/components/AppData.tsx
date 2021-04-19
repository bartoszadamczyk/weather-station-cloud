import React, { ReactElement, Suspense } from "react"
import { Spin, Typography } from "antd"
import "antd/dist/antd.css"
import "../helpers/i18n"
import AppUI from "./AppUI"
import FullPageWrapper from "./FullPageWrapper"
import { AppContextProvider } from "../providers/AppContext"
import { WebSocketProvider } from "../providers/WebSocketContext"
import { Config } from "../helpers/config"

const Loader = () => (
  <div className="Loader">
    <FullPageWrapper>
      <Spin />
    </FullPageWrapper>
  </div>
)

const MissingWebSocketUrlError = () => (
  <div className="Loader">
    <FullPageWrapper>
      <Typography.Text>Missing WebSocket URL</Typography.Text>
    </FullPageWrapper>
  </div>
)

const AppData = (): ReactElement => {
  return (
    <AppContextProvider>
      {Config.WebSocketUrl ? (
        <WebSocketProvider webSocketUrl={Config.WebSocketUrl}>
          <Suspense fallback={<Loader />}>
            <AppUI />
          </Suspense>
        </WebSocketProvider>
      ) : (
        <MissingWebSocketUrlError />
      )}
    </AppContextProvider>
  )
}

export default AppData
