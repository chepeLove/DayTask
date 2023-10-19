import {combineReducers, legacy_createStore as createStore} from "redux";
import {TodolistsReducer} from "../reducers/todolists-reducer";
import {TasksReducer} from "../reducers/tasks-reducer";

const RootReducer = combineReducers({
    todolists:TodolistsReducer,
    tasks:TasksReducer
})

export type AppRootStateType = ReturnType<typeof RootReducer>

export const store = createStore(RootReducer)

// @ts-ignore
window.store = store;