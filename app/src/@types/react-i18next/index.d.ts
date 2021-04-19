// import { TFuncKey } from "react-i18next"
import translation from "../../locales/en/translation.json"
// import { StringMap, TOptions } from "i18next"

declare module "react-i18next" {
  interface Resources {
    translation: typeof translation
  }
}

