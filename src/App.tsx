import React, {useState} from 'react';
import './App.css';
import {Todolist} from './components/Todolist';

export type namePropsType = 'All'|'Active'|'Completed'| 'The first three'

function App() {

    let [tasks ,setTasks]= useState([
        {id: 1, title: "HTML&CSS", isDone: true},
        {id: 2, title: "JS", isDone: true},
        {id: 3, title: "ReactJS", isDone: false},
        {id: 4, title: "Rest API", isDone: false},
        {id: 5, title: "GraphQL", isDone: false},
    ])

    let [filter,setFilter] = useState<namePropsType>('All')

    let [titleInput,setTitleInput] = useState<string>('')



    return (
        <div className="App">
            <Todolist title = "What to learn"
                      tasks={tasks}
                      setTasks={setTasks}
                      setFilter={setFilter}
                      filter={filter}
                      titleInput={titleInput}
                      setTitleInput={setTitleInput}
            />
        </div>
    );
}

export default App;
