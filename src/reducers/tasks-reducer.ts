import {AddTodolistACType, changeEntityStatusAC, RemoveTodolistACType, SetTodolistsACType} from "./todolists-reducer";
import {taskAPI, TaskPriorities, TasksStatuses, TaskType, UpdateTaskType} from "../api/api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../store/store";
import {setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

const initialState:TasksStateType = {}

export const TasksReducer = (state= initialState, action:GeneralACType):TasksStateType => {
    switch (action.type){
        case 'SET-TASKS':{
            return {...state,[action.payload.todolistId]:action.payload.tasks}
        }
        case 'ADD-TASK':{
            return {...state, [action.payload.todolistId]: [action.payload.task, ...state[action.payload.todolistId]]}
        }
        case 'REMOVE-TASK':{
            return {...state,[action.payload.todolistId]:state[action.payload.todolistId]
                    .filter(t => t.id !== action.payload.taskId)}
        }
        case 'UPDATE-TASK':{
           return  {...state,[action.payload.todolistId]: state[action.payload.todolistId]
                   .map(task => task.id === action.payload.taskId ? {...task, ...action.payload.model} : task)}
        }
        case 'ADD-TODOLIST':{
            return {...state,[action.payload.todolist.id]:[]}
        }
        case 'REMOVE-TODOLIST':{
            const {[action.payload.id]:[],...rest}=state
            return rest
        }
        case 'SET-TODOLISTS':{
             return action.payload.todolists.reduce((copyState,el)=>{
                copyState[el.id]=[]
                return  copyState
            },{...state})
        }
        default:{
            return state
        }
    }
}

//Actions
export const addTaskAC = (todolistId: string, task: TaskType) =>
    ({type:'ADD-TASK', payload:{todolistId, task}} as const)
export const removeTaskAC = (todolistId: string, taskId: string) =>
    ({type:'REMOVE-TASK', payload:{todolistId,taskId}}as const)
export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) =>
    ({type: 'UPDATE-TASK', payload:{todolistId, taskId, model}}as const)
export const setTasksAC = (todolistId:string,tasks: TaskType[]) =>
    ({type: "SET-TASKS", payload:{tasks, todolistId}}as const)

//Thunks
export const setTasksTC = (todolistId:string) => async (dispatch:Dispatch)=> {
    try{
        dispatch(setAppStatusAC('loading'))
        dispatch(changeEntityStatusAC(todolistId,'loading'))
        const result = await  taskAPI.getTasks(todolistId)
        console.log(result)
        dispatch(setTasksAC(todolistId,result.data.items))
        dispatch(setAppStatusAC('succeeded'))
        dispatch(changeEntityStatusAC(todolistId,'succeeded'))
    }
    catch (error:any) {
        handleServerNetworkError(error,dispatch)
        dispatch(changeEntityStatusAC(todolistId,'failed'))
    }
}
export const createTaskTC = (todolistId:string,title:string) => async (dispatch:Dispatch)=> {
    try{
        dispatch(setAppStatusAC('loading'))
        dispatch(changeEntityStatusAC(todolistId,'loading'))
        const result = await  taskAPI.createTask(todolistId,title)
        if(result.data.resultCode === 0){
            dispatch(addTaskAC(todolistId,result.data.data.item))
        }else {
            handleServerAppError(result.data,dispatch)
        }
        dispatch(setAppStatusAC('succeeded'))
        dispatch(changeEntityStatusAC(todolistId,'succeeded'))
    }
    catch (error:any) {
        handleServerNetworkError(error,dispatch)
        dispatch(changeEntityStatusAC(todolistId,'failed'))
    }
}
export const deleteTaskTC = (todolistId:string,taskId:string) => async (dispatch:Dispatch)=> {
    try{
        dispatch(setAppStatusAC('loading'))
        dispatch(changeEntityStatusAC(todolistId,'loading'))
        const result = await  taskAPI.deleteTask(todolistId,taskId)
        dispatch(removeTaskAC(todolistId,taskId))
        dispatch(setAppStatusAC('succeeded'))
        dispatch(changeEntityStatusAC(todolistId,'succeeded'))
    }
    catch (error:any) {
        handleServerNetworkError(error,dispatch)
        dispatch(changeEntityStatusAC(todolistId,'failed'))
    }
}
export const updateTaskTC = (todolistId:string, taskId:string, domainModel:UpdateDomainTaskModelType) =>
    async (dispatch:Dispatch, getState:()=>AppRootStateType)=> {

    const task = getState().tasks[todolistId].find(task => task.id === taskId)

    if(!task){
        console.warn('task not found in the state')
        return
    }

    const apiModel:UpdateTaskType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...domainModel
    }

    try{
        dispatch(setAppStatusAC('loading'))
        dispatch(changeEntityStatusAC(todolistId,'loading'))
        const result = await  taskAPI.updateTask(todolistId,taskId,apiModel)
        if(result.data.resultCode === 0){
            dispatch(updateTaskAC(todolistId,taskId,domainModel))
        } else {
            handleServerAppError(result.data, dispatch)
        }
        dispatch(setAppStatusAC('succeeded'))
        dispatch(changeEntityStatusAC(todolistId,'succeeded'))
    }
    catch (error:any) {
        handleServerNetworkError(error,dispatch)
        dispatch(changeEntityStatusAC(todolistId,'failed'))
    }
}

//Types
export type TasksStateType = {
    [key: string]: TaskType[]
}

type GeneralACType = AddTaskACType | RemoveTaskACType
    | ChangeTaskStatusACType | AddTodolistACType
    | RemoveTodolistACType | SetTasksAC | SetTodolistsACType

type AddTaskACType = ReturnType<typeof addTaskAC>
type RemoveTaskACType = ReturnType<typeof removeTaskAC>
type ChangeTaskStatusACType = ReturnType<typeof updateTaskAC>
type SetTasksAC = ReturnType<typeof setTasksAC>

type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TasksStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}