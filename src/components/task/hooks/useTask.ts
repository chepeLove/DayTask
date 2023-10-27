import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../../store/store";
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    TaskType,
} from "../../../reducers/tasks-reducer";
import {useCallback} from "react";
import {FilterValuesType} from "../../../reducers/todolists-reducer";

export const useTask = (todolistId:string) => {

    const tasks = useSelector<AppRootStateType,TaskType[]>(state => state.tasks[todolistId])
    const dispatch = useDispatch()

    const addTask= useCallback((taskTitle:string)=>{
        dispatch(addTaskAC(todolistId, taskTitle))
    },[dispatch])

    const removeTask = useCallback((id: string) => {
        dispatch(removeTaskAC(todolistId, id))
    }, [dispatch])

    const changeTaskStatus = useCallback((isDone: boolean, id: string) => {
        dispatch(changeTaskStatusAC(todolistId, id, isDone))
    }, [dispatch])

    const changeTitleTask = useCallback((newTitle: string, id: string) => {
        dispatch(changeTaskTitleAC(todolistId, id, newTitle))
    }, [dispatch])

    const getTaskForRender = (tasks: TaskType[], filter: FilterValuesType) => {
        switch (filter) {
            case 'active':
                return tasks.filter(t => !t.isDone)
            case 'completed':
                return tasks.filter(t => t.isDone)
            default:
                return tasks
        }
    }

    return{
        tasks,
        removeTask,
        changeTaskStatus,
        changeTitleTask,
        addTask,
        getTaskForRender
    }
}