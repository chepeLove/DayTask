import {Dispatch} from "redux";
import {todolistAPI, TodolistType} from "../api/api";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "./app-reducer";

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
        case 'CHANGE-ENTITY-STATUS':{
            return state.map((todolist)=> todolist.id === action.payload.id ?
                {...todolist,entityStatus:action.payload.status}:todolist)
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
export const changeEntityStatusAC = (id:string,status: RequestStatusType) =>
    ({type: 'CHANGE-ENTITY-STATUS', payload: {id,status}} as const)

//Thunks
export const setTodolistTC = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const result = await todolistAPI.getTodolists()
        dispatch(setTodolistsAC(result.data))
        dispatch(setAppStatusAC('succeeded'))
    } catch (error:any) {
        dispatch(setAppErrorAC(error.message))
        dispatch(setAppStatusAC('failed'))
    }
}
export const createTodolistTC = (title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const result = await todolistAPI.createTodolist(title)
        dispatch(addTodolistAC(result.data.data.item))
        dispatch(setAppStatusAC('succeeded'))
    } catch (error:any) {
        dispatch(setAppErrorAC(error.message))
        dispatch(setAppStatusAC('failed'))
    }
}
export const deleteTodolistTC = (id: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeEntityStatusAC(id,'loading'))
        const result = await todolistAPI.deleteTodolist(id)
        dispatch(removeTodolistAC(id))
        dispatch(setAppStatusAC('succeeded'))
    } catch (error:any) {
        dispatch(setAppErrorAC(error.message))
        dispatch(setAppStatusAC('failed'))
        dispatch(changeEntityStatusAC(id,'failed'))
    }
}
export const updateTodolistTitleTC = (id: string, title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeEntityStatusAC(id,'loading'))
        const result = await todolistAPI.updateTodolistTitle(id, title)
        dispatch(changeTitleTodolistAC(id, title))
        dispatch(setAppStatusAC('succeeded'))
        dispatch(changeEntityStatusAC(id,'succeeded'))
    } catch (error:any) {
        dispatch(setAppErrorAC(error.message))
        dispatch(setAppStatusAC('failed'))
        dispatch(changeEntityStatusAC(id,'failed'))
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
type ChangeEntityStatusACType = ReturnType<typeof changeEntityStatusAC>



