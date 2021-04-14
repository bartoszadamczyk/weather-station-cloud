import React, { ReactElement, Suspense } from "react"
import { Spin } from "antd"
import "antd/dist/antd.css"
import "../helpers/i18n"
import AppUI from "./AppUI"
import FullPageWrapper from "./FullPageWrapper"
import { AppContextProvider } from "../providers/AppContext"
import { WebSocketProvider } from "../providers/WebSocketContext"

const Loader = () => (
  <div className="Loader">
    <FullPageWrapper>
      <Spin />
    </FullPageWrapper>
  </div>
)

const AppData = (): ReactElement => {
  return (
    <AppContextProvider>
      <WebSocketProvider>
        <Suspense fallback={<Loader />}>
          <AppUI />
        </Suspense>
      </WebSocketProvider>
    </AppContextProvider>
  )
}

export default AppData
