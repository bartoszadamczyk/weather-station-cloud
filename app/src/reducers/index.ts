import { Dispatch, useReducer } from "react"
import { produce } from "immer"
import { DataActions, dataInitialState, dataReducer, DataState } from "./data"
import { WebSocketActions, webSocketInitialState, webSocketReducer, WebSocketState } from "./webSocket"

export type State = {
  data: DataState
  webSocket: WebSocketState
}

export const initialState: State = {
  data: dataInitialState,
  webSocket: webSocketInitialState
}

export type Actions = DataActions | WebSocketActions

const mainReducer = (state: State, action: Actions) => {
  dataReducer(state.data, action)
  webSocketReducer(state.webSocket, action)
}

const immerReducerFunction = produce(mainReducer)

export const useAppReducer = (): [State, Dispatch<Actions>] => useReducer(immerReducerFunction, initialState)
