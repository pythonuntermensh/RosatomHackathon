import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {clusterApi} from "./services/ClusterApi";

const rootReducer = combineReducers({
  [clusterApi.reducerPath]: clusterApi.reducer,
})

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({}).concat([clusterApi.middleware]),
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']