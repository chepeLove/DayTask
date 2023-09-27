import {TasksStateType, TaskType} from "../App";
import {v1} from "uuid";


type GeneralACType = AddTaskACType | RemoveTaskACType
    | ChangeTaskStatusACType | AddTaskInNewTodolistACType | ChangeTaskTitleACType
export const TaskReducer = (tasks:TasksStateType,action:GeneralACType) => {
    switch (action.type){
        case 'ADD-TASK':{
            const newTask: TaskType = {
                id: v1(),
                title: action.payload.taskTitle,
                isDone: false
            }
            return {...tasks, [action.payload.todolistId]: [newTask, ...tasks[action.payload.todolistId]]}
        }
        case 'REMOVE-TASK':{
            return {...tasks, [action.payload.todolistId]: tasks[action.payload.todolistId]
                    .filter(t => t.id !== action.payload.taskId)}
        }
        case 'CHANGE-TASK-STATUS':{
           return  {...tasks, [action.payload.todolistId]: tasks[action.payload.todolistId]
                   .map(t => t.id === action.payload.taskId ? {...t, isDone: action.payload.taskStatus} : t)}
        }
        case 'ADD-TASK-IN-NEW-TODOLIST':{
            return {...tasks, [action.payload.newTodolistId]:[]}
        }
        case 'CHANGE-TASK-TITLE':{
            return {...tasks,[action.payload.todolistId]:tasks[action.payload.todolistId]
                    .map(task => task.id === action.payload.taskId ?
                        {...task,title:action.payload.newTitle}
                        : task)}
        }
        default:{
            return tasks
        }
    }
}

type AddTaskACType = ReturnType<typeof addTaskAC>
export const addTaskAC = (todolistId: string, taskTitle: string) => {
    return {
        type:'ADD-TASK',
        payload:{
            todolistId,
            taskTitle
        }
    }as const
}

type RemoveTaskACType = ReturnType<typeof removeTaskAC>

export const removeTaskAC = (todolistId: string, taskId: string) => {
    return{
        type:'REMOVE-TASK',
        payload:{
            todolistId,
            taskId
        }
    }as const
}

type ChangeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>

export const changeTaskStatusAC = (todolistId: string, taskId: string, taskStatus: boolean) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload:{
            todolistId,
            taskId,
            taskStatus
        }
    }as const
}

type AddTaskInNewTodolistACType = ReturnType<typeof addTaskInNewTodolistAC>

export const addTaskInNewTodolistAC = (newTodolistId:string) =>{
    return {
        type: 'ADD-TASK-IN-NEW-TODOLIST',
        payload:{
            newTodolistId
        }
    }as const
}

type ChangeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>

export  const changeTaskTitleAC = (todolistId:string,taskId:string,newTitle:string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        payload:{
            todolistId,
            taskId,
            newTitle
        }
    }as const
}

