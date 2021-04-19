import translation from "../../locales/en/translation.json"

declare module "react-i18next" {
  interface Resources {
    translation: typeof translation
  }
}
