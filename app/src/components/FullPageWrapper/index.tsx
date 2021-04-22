import React, { ReactElement } from "react"
import "./FullPageWrapper.css"

const FullPageWrapper = ({ children }: { children: React.ReactNode }): ReactElement => {
  return <div className="FullPageWrapper">{children}</div>
}

export default FullPageWrapper
