import React, { ReactElement } from "react"
import { useTranslation } from "react-i18next"
import { Typography } from "antd"
import LanguagePicker from "./LanguagePicker"
import logo from "../assets/weather-logo.svg"

const { Title } = Typography
import "./AppHeader.scss"

const AppHeader = (): ReactElement => {
  const { t } = useTranslation()
  return (
    <div className="AppHeader">
      <div className="Logo">
        <img alt={t("logoTitle" as const)} src={logo} />
        <Title>{t("title" as const)}</Title>
      </div>
      <div className="Lang">
        <LanguagePicker />
      </div>
    </div>
  )
}

export default AppHeader
