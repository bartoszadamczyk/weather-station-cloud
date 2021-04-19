import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import antLocaleEnGB from "antd/lib/locale/en_GB"
import antLocaleElPL from "antd/lib/locale/pl_PL"

import i18nLocaleEnGB from "../locales/en/translation.json"
import i18nLocalePlPL from "../locales/pl/translation.json"

import { Locale } from "antd/lib/locale-provider"

enum Languages {
  EN = "en",
  PL = "pl"
}

export const getAntLocale = (language: string): Locale => {
  switch (language.toLowerCase().slice(0, 2)) {
    case Languages.EN:
      return antLocaleEnGB
    case Languages.PL:
      return antLocaleElPL
    default:
      return antLocaleEnGB
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

// Instead of using i18next-http-backend, importing translations directly to improve load time
// Yes this increases bundle size, however with small files it cuts 300-500ms
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: Languages.EN,
    resources: {
      en: {
        translation: i18nLocaleEnGB
      },
      pl: {
        translation: i18nLocalePlPL
      }
    },
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  })

export default i18n
