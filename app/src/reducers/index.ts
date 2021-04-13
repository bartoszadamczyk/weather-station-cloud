import { Dispatch, useReducer } from "react"
import { produce } from "immer"
import { ThemeAction, themeInitialState, themeReducer, ThemeState } from "./theme"
import { MetricAction, metricInitialState, metricReducer, MetricState } from "./metric"
import { WebSocketAction, webSocketInitialState, webSocketReducer, WebSocketState } from "./webSocket"

export type State = {
  metric: MetricState
  theme: ThemeState
  webSocket: WebSocketState
}

export const initialState: State = {
  metric: metricInitialState,
  theme: themeInitialState,
  webSocket: webSocketInitialState
}

export type Actions = MetricAction | ThemeAction | WebSocketAction

const mainReducer = (state: State, action: Actions) => {
  metricReducer(state.metric, action)
  themeReducer(state.theme, action)
  webSocketReducer(state.webSocket, action)
}

const immerReducerFunction = produce(mainReducer)

export const useAppReducer = (): [State, Dispatch<Actions>] => useReducer(immerReducerFunction, initialState)
