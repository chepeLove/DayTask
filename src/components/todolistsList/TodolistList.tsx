import React from 'react';
import {useTodolist} from "../todolist/hooks/useTodolist";
import {useAppSelector} from "../../store/hooks/hooks";
import {RequestStatusType} from "../../reducers/app-reducer";
import {Todolist} from "../todolist/Todolist";
import {LinearProgress} from "../linearProgress/LinearProgress";
import {AddItemForm} from "../addItemForm/AddItemForm";
import {Navigate} from "react-router-dom";
import s from './TodolistsList.module.css'

export const TodolistList = () => {

    const {todolist, addTodolist} = useTodolist()
    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const  isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

    if(!isLoggedIn){
        return <Navigate to={'/login'}/>
    }

    const todolistComponents = todolist.map(todolist => <Todolist key={todolist.id} todolist={todolist}/>)

    return (
        <>
            {status === 'loading' && <LinearProgress/>}
            <div className={s.list}>
                <AddItemForm addItem={addTodolist} disabled={status === 'loading'}/>
                {todolistComponents}
            </div>
        </>
    );
};
