import { Dispatch, useReducer } from "react"
import { produce } from "immer"
import { ThemeAction, themeInitialState, themeReducer, ThemeState } from "./theme"
import { WebSocketAction, webSocketInitialState, webSocketReducer, WebSocketState } from "./webSocket"

export type State = {
  theme: ThemeState
  webSocket: WebSocketState
}

export const initialState: State = {
  theme: themeInitialState,
  webSocket: webSocketInitialState
}

export type Actions = ThemeAction | WebSocketAction

const mainReducer = (state: State, action: Actions) => {
  themeReducer(state.theme, action)
  webSocketReducer(state.webSocket, action)
}

const immerReducerFunction = produce(mainReducer)

export const useAppReducer = (): [State, Dispatch<Actions>] => useReducer(immerReducerFunction, initialState)
