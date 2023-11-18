import React from 'react';
import './App.css';
import {Todolist} from './components/todolist/Todolist';
import {AddItemForm} from "./components/addItemForm/AddItemForm";
import {useTodolist} from "./components/todolist/hooks/useTodolist";
import {LinearProgress} from "./components/linearProgress/LinearProgress";
import {useAppSelector} from "./store/hooks/hooks";
import {RequestStatusType} from "./reducers/app-reducer";
import {ErrorSnackbar} from "./components/errorSnackbar/ErrorSnackbar";


function App() {

    const {todolist, addTodolist} = useTodolist()
    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const error = useAppSelector<string | null>(state => state.app.error)

    const todolistComponents: JSX.Element[] = todolist.map(todolist => {
        return (
            <>
                <Todolist
                    key={todolist.id}
                    todolist={todolist}
                />
            </>
        );
    })

    return (
        <>
            {status === 'loading' && <LinearProgress/>}
            <div className="App">
                <AddItemForm addItem={addTodolist}/>
                {todolistComponents}
            </div>
            {error && <ErrorSnackbar/>}</>
    );
}

export default App;
