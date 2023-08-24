import React, {useRef, useState} from 'react';
import './App.css';
import {Todolist} from './components/Todolist';
import {v1} from "uuid";

export type namePropsType = 'All'|'Active'|'Completed'

function App() {

    let [tasks ,setTasks]= useState([
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "ReactJS", isDone: false},
        {id: v1(), title: "Rest API", isDone: false},
        {id: v1(), title: "GraphQL", isDone: false},
    ])

    let [filter,setFilter] = useState<namePropsType>('All')

    const onChangeRef =useRef< HTMLInputElement>(null)

    return (
        <div className="App">
            <Todolist title = "What to learn"
                      tasks={tasks}
                      setTasks={setTasks}
                      setFilter={setFilter}
                      filter={filter}
                      onChangeRef={onChangeRef}
            />
        </div>
    );
}

export default App;
