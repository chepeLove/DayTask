import {Dispatch} from "redux";
import {RESULT_CODE, todolistAPI, TodolistType} from "../api/api";
import {RequestStatusType,setAppStatusAC} from "./app-reducer";
import axios from "axios";
import {ErrorType, handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AppDispatch, AppThunk} from "../store/store";
import {setTasksTC} from "./tasks-reducer";

const initialState: TodolistDomainType[] = []

export const TodolistsReducer = (state = initialState, action: TodolstsActionsType) => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            return action.payload.todolists.map((el) => ({...el, filter: 'all', entityStatus: 'idle'}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(t => t.id !== action.payload.id)
        }
        case 'CHANGE-FILTER': {
            return state.map(t => t.id === action.payload.id ?
                {...t, filter: action.payload.filter} : t)
        }
        case 'ADD-TODOLIST': {
            let newTodolist: TodolistDomainType = {...action.payload.todolist, filter: 'all', entityStatus: 'idle'}
            return [...state, newTodolist]
        }
        case 'CHANGE-TITLE-TODOLIST': {
            return state.map(todolist => todolist.id === action.payload.id ?
                {...todolist, title: action.payload.title} : todolist)
        }
        case 'CHANGE-TODOLIST-ENTITY-STATUS': {
            return state.map((todolist) => todolist.id === action.payload.id ?
                {...todolist, entityStatus: action.payload.status} : todolist)
        }
        default:
            return state
    }

}

//Actions
export const removeTodolistAC = (id: string) =>
    ({type: 'REMOVE-TODOLIST', payload: {id}} as const)
export const changeFilterAC = (id: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-FILTER', payload: {id, filter}} as const)
export const addTodolistAC = (todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST', payload: {todolist}} as const)
export const changeTitleTodolistAC = (id: string, title: string) =>
    ({type: 'CHANGE-TITLE-TODOLIST', payload: {id, title}} as const)
export const setTodolistsAC = (todolists: TodolistType[]) =>
    ({type: "SET-TODOLISTS", payload: {todolists}} as const)
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) =>
    ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', payload: {id, status}} as const)

//Thunks
export const setTodolistTC = ():AppThunk => async (dispatch: AppDispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const result = await todolistAPI.getTodolists()
        dispatch(setTodolistsAC(result.data))
        dispatch(setAppStatusAC('succeeded'))
        result.data.forEach((todolist)=> {
            dispatch(setTasksTC(todolist.id))
        })
    } catch (error) {
        if (axios.isAxiosError<ErrorType>(error)) {
            const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message
            handleServerNetworkError(dispatch, errorMessage)
        } else {
            handleServerNetworkError(dispatch, (error as Error).message)
        }
    }
}
export const createTodolistTC = (title: string):AppThunk => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const result = await todolistAPI.createTodolist(title)
        if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
            dispatch(addTodolistAC(result.data.data.item))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(result.data, dispatch)
            dispatch(setAppStatusAC('failed'))
        }
    } catch (error) {
        if (axios.isAxiosError<ErrorType>(error)) {
            const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message
            handleServerNetworkError(dispatch, errorMessage)
        } else {
            handleServerNetworkError(dispatch, (error as Error).message)
        }
    }
}
export const deleteTodolistTC = (id: string):AppThunk => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTodolistEntityStatusAC(id, 'loading'))
        const result = await todolistAPI.deleteTodolist(id)
        if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
            dispatch(removeTodolistAC(id))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(result.data, dispatch)
            dispatch(setAppStatusAC('failed'))
        }
    } catch (error) {
        if (axios.isAxiosError<ErrorType>(error)) {
            const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message
            handleServerNetworkError(dispatch, errorMessage)
        } else {
            handleServerNetworkError(dispatch, (error as Error).message)
        }
    }
}
export const updateTodolistTitleTC = (id: string, title: string):AppThunk => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTodolistEntityStatusAC(id, 'loading'))
        const result = await todolistAPI.updateTodolistTitle(id, title)
        if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
            dispatch(changeTitleTodolistAC(id, title))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(changeTodolistEntityStatusAC(id, 'succeeded'))
        } else {
            handleServerAppError(result.data, dispatch)
            dispatch(setAppStatusAC('failed'))
            dispatch(changeTodolistEntityStatusAC(id, 'failed'))
        }
    } catch (error) {
        if (axios.isAxiosError<ErrorType>(error)) {
            const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message
            handleServerNetworkError(dispatch, errorMessage)
        } else {
            handleServerNetworkError(dispatch, (error as Error).message)
        }
    }
}

//Types
export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export type TodolstsActionsType =
    RemoveTodolistACType
    | ChangeFilterAC
    | AddTodolistACType
    | ChangeTitleTodolistACType
    | SetTodolistsACType
    | ChangeEntityStatusACType

export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
type ChangeFilterAC = ReturnType<typeof changeFilterAC>
export type AddTodolistACType = ReturnType<typeof addTodolistAC>
type ChangeTitleTodolistACType = ReturnType<typeof changeTitleTodolistAC>
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>
type ChangeEntityStatusACType = ReturnType<typeof changeTodolistEntityStatusAC>



