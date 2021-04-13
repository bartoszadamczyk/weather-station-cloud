import React, { createContext, Dispatch, ReactElement, useMemo } from "react"

import { State, initialState, useAppReducer, Actions } from "../reducers"

export const AppContext = createContext<{
  state: State
  dispatch: Dispatch<Actions>
}>({
  state: initialState,
  dispatch: () => undefined
})

export const AppContextProvider = ({ children }: { children: React.ReactNode }): ReactElement => {
  const [state, dispatch] = useAppReducer()
  const contextValue = useMemo(() => {
    return { state, dispatch }
  }, [state, dispatch])
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}
