
import {Dispatch} from "redux";
import {todolistAPI, TodolistType} from "../api/api";

export type FilterValuesType = 'all'|'active'|'completed'

export type TodolistDomainType = TodolistType & {
    filter:FilterValuesType
}

export type TodolstsActionsType = RemoveTodolistACType | ChangeFilterAC | AddTodolistACType
    | ChangeTitleTodolistACType | SetTodolistsACType

const initialState:TodolistDomainType[] = []

export const TodolistsReducer = (state = initialState, action:TodolstsActionsType) => {
    switch (action.type){
        case 'SET-TODOLISTS':{
            return action.payload.todolists.map((el)=> ({...el,filter:'all'}))
        }
        case 'REMOVE-TODOLIST':{
            return state.filter(t => t.id !== action.payload.todolistId)
        }
        case 'CHANGE-FILTER':{
            return state.map(t => t.id === action.payload.todolistId ?
                {...t, filter:action.payload.filter}
                : t)
        }
        case 'ADD-TODOLIST':{
            let newTodolist:TodolistDomainType = {...action.payload.todolist,filter:'all'}
            return [...state,newTodolist]
        }
        case 'CHANGE-TITLE-TODOLIST':{
            return state.map(todolist => todolist.id === action.payload.todolistId ?
                {...todolist,todolistTitle:action.payload.todolistTitle}
                :todolist)
        }
        default:
            return state
    }

}


export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
export const removeTodolistAC = (todolistId: string) => {
    return {
        type: 'REMOVE-TODOLIST' as const,
        payload:{
            todolistId
        }
    }
}

type ChangeFilterAC = ReturnType<typeof changeFilterAC>

export const changeFilterAC = (todolistId: string, filter: FilterValuesType) => {

    return{
        type: 'CHANGE-FILTER' as const,
        payload:{
            todolistId,
            filter
        }
    }
}

export type AddTodolistACType = ReturnType<typeof addTodolistAC>

export const addTodolistAC = (todolist:TodolistType) => {

    return {
        type: 'ADD-TODOLIST' as const,
        payload:{
            todolist
        }
    }
}

type ChangeTitleTodolistACType = ReturnType<typeof changeTitleTodolistAC>
export const changeTitleTodolistAC = (todolistId:string,todolistTitle:string) => {
    return{
        type: 'CHANGE-TITLE-TODOLIST' as const,
        payload:{
            todolistId,
            todolistTitle
        }
    }
}

export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>
export const setTodolistsAC = (todolists: TodolistType[]) => {
    return {
        type: "SET-TODOLISTS" as const,
        payload:{
            todolists
        }
    }
}

export const setTodolistTC = () => async (dispatch:Dispatch)=> {
    try{
        const result = await  todolistAPI.getTodolists()
        dispatch(setTodolistsAC(result.data))
    }
    catch (e) {
        console.log(e)
    }
}


export const createTodolistTC = (title:string) => async (dispatch:Dispatch)=> {
    try{
        const result = await  todolistAPI.createTodolist(title)
        dispatch(addTodolistAC(result.data.data.item))
    }
    catch (e) {
        console.log(e)
    }
}

export const deleteTodolistTC = (id:string) => async (dispatch:Dispatch)=> {
    try{
        const result = await  todolistAPI.deleteTodolist(id)
        dispatch(removeTodolistAC(id))
    }
    catch (e) {
        console.log(e)
    }
}

export const updateTodolistTitleTC = (id:string,title:string) => async (dispatch:Dispatch)=> {
    try{
        const result = await  todolistAPI.updateTodolistTitle(id,title)
        dispatch(changeTitleTodolistAC(id,title))
    }
    catch (e) {
        console.log(e)
    }
}









