import React, { ReactElement } from "react"
import { useTranslation } from "react-i18next"
import { Typography, Space, Divider } from "antd"

const { Link } = Typography

const LanguagePicker = (): ReactElement => {
  const { t } = useTranslation("translation")
  const { i18n } = useTranslation()

  const changeLang = (lang: string) => {
    return () => i18n.changeLanguage(lang)
  }
  const isLangSelected = (lang: string) => {
    return i18n.language.toLowerCase().startsWith(lang)
  }

  return (
    <Space split={<Divider type="vertical" />}>
      <Link onClick={changeLang("en")} disabled={isLangSelected("en")}>
        {t("languages.en")}
      </Link>
      <Link onClick={changeLang("pl")} disabled={isLangSelected("pl")}>
        {t("languages.pl")}
      </Link>
    </Space>
  )
}

export default LanguagePicker
