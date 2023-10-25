import React, {useCallback} from 'react';
import './App.css';
import {Todolist} from './components/Todolist';
import {AddItemForm} from "./components/AddItemForm";
import {addTodolistAC, TodolistType,} from "./reducers/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store/store";


function App() {

    const todolist = useSelector<AppRootStateType,TodolistType[]>(state => state.todolists)
    const dispatch = useDispatch()


    const addTodolist = useCallback((title:string) => {
        let action = addTodolistAC(title)
        dispatch(action)
    },[dispatch])
    
    const todolistComponents: JSX.Element[] = todolist.map(todolist => {
        return (
            <Todolist
                key={todolist.todolistId}
                todolist={todolist}
            />
        );
    })

    return (
        <div className="App">
            <AddItemForm addItem={addTodolist}/>
            {todolistComponents}
        </div>
    );
}

export default App;
