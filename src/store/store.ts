import {combineReducers, legacy_createStore as createStore, compose, applyMiddleware, AnyAction} from "redux";
import {TodolistsReducer, TodolstsActionsType} from "../reducers/todolists-reducer";
import {TasksReducer} from "../reducers/tasks-reducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";

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

export type AppActionsType = TodolstsActionsType

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown,AnyAction> //это когда санка вызывает санку

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppRootStateType,
    unknown,
    AnyAction
>

export const store = createStore(RootReducer,applyMiddleware(thunk))

// @ts-ignore
window.store = store;