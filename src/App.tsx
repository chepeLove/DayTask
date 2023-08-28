import React, {useState} from 'react';
import './App.css';
import {Todolist} from './components/Todolist';
import {v1} from "uuid";

export type namePropsType = 'All'|'Active'|'Completed'

function App() {

    const [tasks ,setTasks]= useState([
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "ReactJS", isDone: false},
        {id: v1(), title: "Rest API", isDone: false},
        {id: v1(), title: "GraphQL", isDone: false},
    ])

    const [filter,setFilter] = useState<namePropsType>('All')

    const [title,setTitle]=useState('')

    const [check,setCheck] = useState<boolean>(false)

    const [error,setError]=useState<string | null>(null)

    return (
        <div className="App">
            <Todolist name = "What to learn"
                      tasks={tasks}
                      setTasks={setTasks}
                      setFilter={setFilter}
                      filter={filter}
                      title={title}
                      setTitle={setTitle}
                      check={check}
                      setCheck={setCheck}
                      error={error}
                      setError={setError}
            />
        </div>
    );
}

export default App;
