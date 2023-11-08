import {
     changeFilterAC,
     createTodolistTC, deleteTodolistTC, FilterValuesType, getTodolistTC,
    TodolistDomainType, updateTodolistTitleTC
} from "../../../reducers/todolists-reducer";
import {useCallback, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../store/hooks/hooks";

export const useTodolist = () => {

    const todolist = useAppSelector<TodolistDomainType[]>(state => state.todolists)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getTodolistTC())
    }, []);


    const addTodolist = useCallback((title:string) => {
        let thunk = createTodolistTC(title)
        dispatch(thunk)
    },[dispatch])

    const removeTodolist = useCallback((todolistId:string) => {
        let thunk = deleteTodolistTC(todolistId)
        dispatch(thunk)
    }, [dispatch])

    const changeTitleTodolist = useCallback((id:string,title:string) => {
        dispatch(updateTodolistTitleTC(id, title))
    }, [dispatch])

    const changeFilterTodolist = useCallback((todolistId:string,filter:FilterValuesType)=>{
        dispatch(changeFilterAC(todolistId, filter))
    },[dispatch])

    return {
        todolist,
        addTodolist,
        removeTodolist,
        changeTitleTodolist,
        changeFilterTodolist
    }
}