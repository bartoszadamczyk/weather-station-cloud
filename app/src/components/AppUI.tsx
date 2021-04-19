import React, { ReactElement } from "react"
import { ConfigProvider } from "antd"
import { IconContext } from "react-icons"
import { getAntLocale } from "../helpers/i18n"
import { useTranslation } from "react-i18next"
import MetricTable from "./MetricTable"
import AppHeader from "./AppHeader"

const AppUI = (): ReactElement => {
  const { i18n } = useTranslation()
  const antLocale = getAntLocale(i18n.language)

  return (
    <IconContext.Provider value={{ size: "15px", style: { display: "block", margin: "0 0 2px" } }}>
      <ConfigProvider locale={antLocale}>
        <AppHeader />
        <MetricTable />
      </ConfigProvider>
    </IconContext.Provider>
  )
}

export default AppUI
