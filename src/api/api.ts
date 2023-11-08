import axios from "axios";

const instance = axios.create({
    baseURL:`https://social-network.samuraijs.com/api/1.1/`,
    withCredentials:true,
    headers:{
        'API-KEY': '80355f25-1716-4bed-9c55-ae7d9e7587da'
    }
})

export type TodolistType = {
    id: string,
    title: string,
    addedDate: string,
    order: number,
}

export type ResponseType<Data = {}> = {
    resultCode:number
    messages:string[]
    data:Data
}

export enum TasksStatuses  {
    New,
    InProgress,
    Completed,
    Draft
}

export enum TaskPriorities {
    Low,
    Middle,
    Hi,
    Urgently,
    Later
}

export type TaskType = {
    description: string
    title: string
    status: TasksStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type TaskResponseType = {
    error:string | null
    totalCount:number
    items:TaskType[]
}

export type UpdateTaskType = {
    title: string
    description: string
    status: TasksStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}


export const todolistAPI = {
    getTodolists(){
        return instance.get<TodolistType[]>('todo-lists')
    },
    createTodolist(title:string){
        return instance.post<ResponseType<{item:TodolistType}>>('todo-lists',{title})
    },
    deleteTodolist(id:string){
        return instance.delete<ResponseType>(`todo-lists/${id}`)
    },
    updateTodolistTitle(id:string,title:string){
        return instance.put(`todo-lists/${id}`,{title})
    }
}

export const taskAPI = {
    getTasks(todolistId:string){
        return instance.get<TaskResponseType>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId:string,title:string){
        return instance.post<ResponseType<{item:TaskType}>>(`todo-lists/${todolistId}/tasks`,{title})
    },
    deleteTask(todolistId:string,taskId:string){
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId:string,taskId:string,model:UpdateTaskType){
        return instance.put(`todo-lists/${todolistId}/tasks/${taskId}`,model)
    }
}