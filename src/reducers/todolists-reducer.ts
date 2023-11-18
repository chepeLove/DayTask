import {Dispatch} from "redux";
import {todolistAPI, TodolistType} from "../api/api";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";

const initialState: TodolistDomainType[] = []

export const TodolistsReducer = (state = initialState, action: TodolstsActionsType) => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            return action.payload.todolists.map((el) => ({...el, filter: 'all',entityStatus:'idle'}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(t => t.id !== action.payload.todolistId)
        }
        case 'CHANGE-FILTER': {
            return state.map(t => t.id === action.payload.todolistId ?
                {...t, filter: action.payload.filter} : t)
        }
        case 'ADD-TODOLIST': {
            let newTodolist: TodolistDomainType = {...action.payload.todolist, filter: 'all',entityStatus:'idle'}
            return [...state, newTodolist]
        }
        case 'CHANGE-TITLE-TODOLIST': {
            return state.map(todolist => todolist.id === action.payload.todolistId ?
                {...todolist, title: action.payload.title} : todolist)
        }
        default:
            return state
    }

}

//Actions
export const removeTodolistAC = (todolistId: string) =>
    ({type: 'REMOVE-TODOLIST' , payload: {todolistId}}as const)
export const changeFilterAC = (todolistId: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-FILTER' , payload: {todolistId, filter}}as const)
export const addTodolistAC = (todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST' , payload: {todolist}}as const)
export const changeTitleTodolistAC = (todolistId: string, title: string) =>
    ({type: 'CHANGE-TITLE-TODOLIST' , payload:{todolistId, title}}as const)
export const setTodolistsAC = (todolists: TodolistType[]) =>
    ({type: "SET-TODOLISTS" , payload: {todolists}}as const)

//Thunks
export const setTodolistTC = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const result = await todolistAPI.getTodolists()
        dispatch(setTodolistsAC(result.data))
        dispatch(setAppStatusAC('succeeded'))
    } catch (e) {
        console.log(e)
    }
}
export const createTodolistTC = (title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const result = await todolistAPI.createTodolist(title)
        dispatch(addTodolistAC(result.data.data.item))
        dispatch(setAppStatusAC('succeeded'))
    } catch (e) {
        console.log(e)
    }
}
export const deleteTodolistTC = (id: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const result = await todolistAPI.deleteTodolist(id)
        dispatch(removeTodolistAC(id))
        dispatch(setAppStatusAC('succeeded'))
    } catch (e) {
        console.log(e)
    }
}
export const updateTodolistTitleTC = (id: string, title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const result = await todolistAPI.updateTodolistTitle(id, title)
        dispatch(changeTitleTodolistAC(id, title))
        dispatch(setAppStatusAC('succeeded'))
    } catch (e) {
        console.log(e)
    }
}

//Types
export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus:RequestStatusType
}

export type TodolstsActionsType =
    RemoveTodolistACType
    | ChangeFilterAC
    | AddTodolistACType
    | ChangeTitleTodolistACType
    | SetTodolistsACType

export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
type ChangeFilterAC = ReturnType<typeof changeFilterAC>
export type AddTodolistACType = ReturnType<typeof addTodolistAC>
type ChangeTitleTodolistACType = ReturnType<typeof changeTitleTodolistAC>
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>



