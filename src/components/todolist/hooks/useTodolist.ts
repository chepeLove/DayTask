import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../../store/store";
import {
    addTodolistAC, changeFilterAC,
    changeTitleTodolistAC, FilterValuesType,
    removeTodolistAC,
    TodolistType
} from "../../../reducers/todolists-reducer";
import {useCallback} from "react";

export const useTodolist = () => {
    const todolist = useSelector<AppRootStateType,TodolistType[]>(state => state.todolists)
    const dispatch = useDispatch()

    const addTodolist = useCallback((title:string) => {
        let action = addTodolistAC(title)
        dispatch(action)
    },[dispatch])

    const removeTodolist = useCallback((todolistId:string) => {
        let action = removeTodolistAC(todolistId)
        dispatch(action)
    }, [dispatch])

    const changeTitleTodolist = useCallback((todolistId:string,todolistTitle:string) => {
        dispatch(changeTitleTodolistAC(todolistId, todolistTitle))
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