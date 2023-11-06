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

export type ResponseTodolistType<Data = {}> = {
    resultCode:number
    messages:string[]
    data:Data
}



export const todolistAPI = {
    getTodolists(){
        return instance.get<TodolistType[]>('todo-lists')
    },
    createTodolist(title:string){
        return instance.post<ResponseTodolistType<{item:TodolistType}>>('todo-lists',{title:title})
    },
    deleteTodolist(id:string){
        return instance.delete<ResponseTodolistType>(`todo-lists/${id}`)
    },
    updateTodolistTitle(id:string,title:string){
        return instance.put(`todo-lists/${id}`,{title:title})
    }
}