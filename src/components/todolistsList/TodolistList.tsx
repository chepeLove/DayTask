import React from 'react';
import {useTodolist} from "../todolist/hooks/useTodolist";
import {useAppSelector} from "../../store/hooks/hooks";
import {Todolist} from "../todolist/Todolist";
import {AddItemForm} from "../addItemForm/AddItemForm";
import {Navigate} from "react-router-dom";
import s from './TodolistsList.module.css'
import {RequestStatusType} from "../../reducers/app-reducer";

export const TodolistList = () => {

    const {todolist, addTodolist} = useTodolist()
    const  isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)
    const status = useAppSelector<RequestStatusType>(state => state.app.status)


    if(!isLoggedIn){
        return <Navigate to={'/login'}/>
    }

    const todolistComponents = todolist.map(todolist => <Todolist key={todolist.id} todolist={todolist}/>)

    return (
        <>
            <div className={s.list}>
                <AddItemForm addItem={addTodolist} disabled={status === 'loading'}/>
                {todolistComponents}
            </div>
        </>
    );
};




