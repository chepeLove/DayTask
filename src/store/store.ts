import {combineReducers, legacy_createStore as createStore,compose} from "redux";
import {TodolistsReducer} from "../reducers/todolists-reducer";
import {TasksReducer} from "../reducers/tasks-reducer";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const RootReducer = combineReducers({
    todolists:TodolistsReducer,
    tasks:TasksReducer
})

export type AppRootStateType = ReturnType<typeof RootReducer>

export const store = createStore(RootReducer,composeEnhancers())

// @ts-ignore
window.store = store;