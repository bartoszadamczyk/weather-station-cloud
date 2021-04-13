import { Actions } from "./index"

export enum THEME {
  DARK = "DARK",
  LIGHT = "LIGHT"
}

export type ThemeState = {
  theme: THEME.LIGHT | THEME.DARK
}

export const themeInitialState: ThemeState = {
  theme: THEME.LIGHT
}

type ToggleThemeAction = {
  type: "TOGGLE_THEME"
}
export type ThemeAction = ToggleThemeAction

export const themeReducer = (draft: ThemeState, action: Actions): void => {
  switch (action.type) {
    case "TOGGLE_THEME":
      draft.theme = draft.theme === THEME.DARK ? THEME.LIGHT : THEME.DARK
      break
  }
}
