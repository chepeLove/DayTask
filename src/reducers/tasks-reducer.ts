import {v1} from "uuid";
import {AddTodolistACType, RemoveTodolistACType} from "./todolists-reducer";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type TasksStateType = {
    [key: string]: TaskType[]
}

type GeneralACType = AddTaskACType | RemoveTaskACType
    | ChangeTaskStatusACType | ChangeTaskTitleACType | AddTodolistACType
    | RemoveTodolistACType


const initialState:TasksStateType = {}

export const TasksReducer = (state= initialState, action:GeneralACType):TasksStateType => {
    switch (action.type){
        case 'ADD-TASK':{
            const newTask: TaskType = {
                id: v1(),
                title: action.payload.taskTitle,
                isDone: false
            }
            return {...state, [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]}
        }
        case 'REMOVE-TASK':{
            return {...state,[action.payload.todolistId]:state[action.payload.todolistId]
                    .filter(t => t.id !== action.payload.taskId)}
        }
        case 'CHANGE-TASK-STATUS':{
           return  {...state,[action.payload.todolistId]: state[action.payload.todolistId]
                   .map(t => t.id === action.payload.taskId ? {...t, isDone: action.payload.taskStatus} : t)}
        }
        case 'CHANGE-TASK-TITLE':{
            return {...state,[action.payload.todolistId]:state[action.payload.todolistId]
                    .map(task => task.id === action.payload.taskId ?
                        {...task,title:action.payload.newTitle} : task)}
        }
        case 'ADD-TODOLIST':{
            return {...state,[action.payload.newTodolistId]:[]}
        }
        case 'REMOVE-TODOLIST':{
            const {[action.payload.todolistId]:[],...rest}=state
            return rest
        }
        default:{
            return state
        }
    }
}

type AddTaskACType = ReturnType<typeof addTaskAC>
export const addTaskAC = (todolistId: string, taskTitle: string) => {
    return {
        type:'ADD-TASK' as const,
        payload:{
            todolistId,
            taskTitle
        }
    }
}

type RemoveTaskACType = ReturnType<typeof removeTaskAC>

export const removeTaskAC = (todolistId: string, taskId: string) => {
    return{
        type:'REMOVE-TASK' as const,
        payload:{
            todolistId,
            taskId
        }
    }
}

type ChangeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>

export const changeTaskStatusAC = (todolistId: string, taskId: string, taskStatus: boolean) => {
    return {
        type: 'CHANGE-TASK-STATUS' as const,
        payload:{
            todolistId,
            taskId,
            taskStatus
        }
    }
}

type ChangeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>

export  const changeTaskTitleAC = (todolistId:string,taskId:string,newTitle:string) => {
    return {
        type: 'CHANGE-TASK-TITLE' as const,
        payload:{
            todolistId,
            taskId,
            newTitle
        }
    }
}

