import {FilterValuesType, TodolistType} from "../App";


type GeneralACType = RemoveTodolistACType | changeFilterAC | addTodolistACType | changeTitleTodolistACType

export const TodolistReducer = (todolist:TodolistType[],action:GeneralACType) => {
    switch (action.type){
        case 'REMOVE-TODOLIST':{
            return todolist.filter(t => t.todolistId !== action.payload.todolistId)
        }
        case 'CHANGE-FILTER':{
            return todolist.map(t => t.todolistId === action.payload.todolistId ?
                {...t, filter:action.payload.filter}
                : t)
        }
        case 'ADD-TODOLIST':{
            let newTodolist:TodolistType = {todolistId:action.payload.newTodolistId,todolistTitle:action.payload.title,filter:'all'}
            return [newTodolist,...todolist]
        }
        case 'CHANGE-TITLE-TODOLIST':{
            return todolist.map(todolist => todolist.todolistId === action.payload.todolistId ?
                {...todolist,todolistTitle:action.payload.todolistTitle}
                :todolist)
        }
        default:
            return todolist
    }

}


type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
export const removeTodolistAC = (todolistId: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload:{
            todolistId
        }
    }as const
}

type changeFilterAC = ReturnType<typeof changeFilterAC>

export const changeFilterAC = (todolistId: string, filter: FilterValuesType) => {

    return{
        type: 'CHANGE-FILTER',
        payload:{
            todolistId,
            filter
        }
    }as const
}

type addTodolistACType = ReturnType<typeof addTodolistAC>

export const addTodolistAC = (title:string,newTodolistId:string) => {

    return {
        type: 'ADD-TODOLIST',
        payload:{
            title,
            newTodolistId
        }
    }as const
}

type changeTitleTodolistACType = ReturnType<typeof changeTitleTodolistAC>
export const changeTitleTodolistAC = (todolistId:string,todolistTitle:string) => {
    return{
        type: 'CHANGE-TITLE-TODOLIST',
        payload:{
            todolistId,
            todolistTitle
        }
    }as const
}



