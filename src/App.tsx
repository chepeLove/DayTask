import React from 'react';
import './App.css';
import {Todolist} from './components/todolist/Todolist';
import {AddItemForm} from "./components/addItemForm/AddItemForm";
import {useTodolist} from "./components/todolist/hooks/useTodolist";


function App() {

    const {todolist,addTodolist} = useTodolist()

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
