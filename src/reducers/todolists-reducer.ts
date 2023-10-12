import {FilterValuesType, TodolistType} from "../App";
import {v1} from "uuid";


type GeneralACType = RemoveTodolistACType | ChangeFilterAC | AddTodolistACType | ChangeTitleTodolistACType

export const TodolistsReducer = (state:TodolistType[], action:GeneralACType) => {
    switch (action.type){
        case 'REMOVE-TODOLIST':{
            return state.filter(t => t.todolistId !== action.payload.todolistId)
        }
        case 'CHANGE-FILTER':{
            return state.map(t => t.todolistId === action.payload.todolistId ?
                {...t, filter:action.payload.filter}
                : t)
        }
        case 'ADD-TODOLIST':{
            let newTodolist:TodolistType = {todolistId:action.payload.newTodolistId,
                todolistTitle:action.payload.title,filter:'all'}
            return [...state,newTodolist]
        }
        case 'CHANGE-TITLE-TODOLIST':{
            return state.map(todolist => todolist.todolistId === action.payload.todolistId ?
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

export const addTodolistAC = (title:string) => {

    return {
        type: 'ADD-TODOLIST' as const,
        payload:{
            title,
            newTodolistId:v1()
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



