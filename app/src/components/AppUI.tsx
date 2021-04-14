import React, { ReactElement } from "react"
import { Button, ConfigProvider } from "antd"
import { IconContext } from "react-icons"
import { IoIosFlag } from "react-icons/all"
import { getAntLocale, getNextLanguage } from "../helpers/i18n"
import { useTranslation } from "react-i18next"
import Metrics from "./Metrics"

const AppUI = (): ReactElement => {
  const { i18n } = useTranslation()
  const antLocale = getAntLocale(i18n.language)

  const toggleLanguage = () => {
    i18n.changeLanguage(getNextLanguage(i18n.language))
  }

  return (
    <ConfigProvider locale={antLocale}>
      <IconContext.Provider value={{ size: "15px", style: { display: "block", margin: "0 0 2px" } }}>
        <Metrics />
        <Button icon={<IoIosFlag />} onClick={toggleLanguage}></Button>
      </IconContext.Provider>
    </ConfigProvider>
  )
}

export default AppUI
