import i18n from "i18next"
import Backend from "i18next-http-backend"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import enGB from "antd/lib/locale/en_GB"
import plPL from "antd/lib/locale/pl_PL"
import { Locale } from "antd/lib/locale-provider"

enum Languages {
  EN = "en",
  PL = "pl"
}

export const getAntLocale = (language: string): Locale => {
  switch (language.toLowerCase().slice(0, 2)) {
    case Languages.EN:
      return enGB
    case Languages.PL:
      return plPL
    default:
      return enGB
  }
}

export const getNextLanguage = (language: string): string => {
  switch (language.toLowerCase().slice(0, 2)) {
    case Languages.EN:
      return Languages.PL
    case Languages.PL:
      return Languages.EN
    default:
      return Languages.EN
  }
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: Languages.EN,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  })

export default i18n
