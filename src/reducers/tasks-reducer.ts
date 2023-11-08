import {AddTodolistACType, RemoveTodolistACType} from "./todolists-reducer";
import {taskAPI, TaskPriorities, TasksStatuses, TaskType, UpdateTaskType} from "../api/api";
import {v1} from "uuid";
import {Dispatch} from "redux";
import {AppRootStateType} from "../store/store";


export type TasksStateType = {
    [key: string]: TaskType[]
}

type GeneralACType = AddTaskACType | RemoveTaskACType
    | ChangeTaskStatusACType | ChangeTaskTitleACType | AddTodolistACType
    | RemoveTodolistACType | GetTasksAC


const initialState:TasksStateType = {}

export const TasksReducer = (state= initialState, action:GeneralACType):TasksStateType => {
    switch (action.type){
        case 'GET-TASKS':{
            return {...state,[action.payload.todolistId]:action.payload.tasks}
        }
        case 'ADD-TASK':{
            const newTask: TaskType = {
                description: '',
                title: action.payload.taskTitle,
                status: TasksStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                id: v1(),
                todoListId: action.payload.todolistId,
                order: 0,
                addedDate: ''

            }
            return {...state, [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]}
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

type ChangeTaskStatusACType = ReturnType<typeof updateTaskAC>

export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) => {
    return {
        type: 'UPDATE-TASK' as const,
        payload:{
            todolistId,
            taskId,
            model
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

type GetTasksAC = ReturnType<typeof getTasksAC>

const getTasksAC = (todolistId:string,tasks: TaskType[]) => {
    return {
        type: "GET-TASKS" as const,
        payload:{
            tasks,
            todolistId
        }
    }
}

export const getTasksTC = (todolistId:string) => async (dispatch:Dispatch)=> {
    try{
        const result = await  taskAPI.getTasks(todolistId)
        dispatch(getTasksAC(todolistId,result.data.items))
    }
    catch (e) {
        console.log(e)
    }
}
export const createTaskTC = (todolistId:string,title:string) => async (dispatch:Dispatch)=> {
    try{
        const result = await  taskAPI.createTask(todolistId,title)
        dispatch(addTaskAC(todolistId,result.data.data.item.title))
    }
    catch (e) {
        console.log(e)
    }
}
export const deleteTaskTC = (todolistId:string,taskId:string) => async (dispatch:Dispatch)=> {
    try{
        const result = await  taskAPI.deleteTask(todolistId,taskId)
        dispatch(removeTaskAC(todolistId,taskId))
    }
    catch (e) {
        console.log(e)
    }
}

 type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TasksStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export const updateTaskTC = (todolistId:string, taskId:string, domainModel:UpdateDomainTaskModelType) => async (dispatch:Dispatch, getState:()=>AppRootStateType)=> {

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
        const result = await  taskAPI.updateTask(todolistId,taskId,apiModel)
        dispatch(updateTaskAC(todolistId,taskId,domainModel))
    }
    catch (e) {
        console.log(e)
    }
}


// export const updateTaskTC = (todolistId: string, taskId: string,domainModel:UpdateDomainTaskModelType) =>
//     async (dispatch: Dispatch, getState: () => AppRootStateType) => {
//         const tasks = getState().tasks[todolistId];
//         try {
//             tasks.map(t => t.id === taskId ? taskAPI.updateTask(todolistId, taskId, {
//                 title: t.title,
//                 startDate: t.startDate,
//                 priority: t.priority,
//                 description: t.description,
//                 deadline: t.deadline,
//                 ...domainModel
//             }).then(() => {
//                 dispatch(updateTaskAC(todolistId, taskId, status))
//             }) : t)
//         } catch (e) {
//             console.log(e)
//         }
//
//     }


