import React, {useState} from 'react';
import './App.css';
import {Todolist} from './components/Todolist';
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm";

export type FilterValuesType = 'all'|'active'|'completed'

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodolistType = {
    todolistId: string
    todolistTitle: string
    filter: FilterValuesType
}

type TasksStateType = {
    [todolistId: string]: TaskType[]
}

function App() {

    //BLL:

    const todolistId1 = v1()
    const todolistId2 = v1()

    const [todolists, setTodolists] = useState<TodolistType[]>([
        {todolistId: todolistId1, todolistTitle: 'What to learn', filter: 'all'},
        {todolistId: todolistId2, todolistTitle: 'What to buy', filter: 'all'}
    ])

    const [tasks, setTasks] = useState<TasksStateType>({
        [todolistId1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},
            {id: v1(), title: 'Rest API', isDone: false},
            {id: v1(), title: 'GraphQL', isDone: false},
        ],
        [todolistId2]: [
            {id: v1(), title: 'Beer', isDone: true},
            {id: v1(), title: 'Fish', isDone: true},
            {id: v1(), title: 'Nuts', isDone: false}
        ]

    });
    //CRUD:

    const addTask = (todolistId: string, taskTitle: string) => {
        const newTask: TaskType = {
            id: v1(),
            title: taskTitle,
            isDone: false
        }
        setTasks({...tasks, [todolistId]: [newTask, ...tasks[todolistId]]})
    }

    function removeTask(todolistId: string, taskId: string) {
        setTasks({...tasks, [todolistId]: tasks[todolistId].filter(t => t.id !== taskId)})
    }

    const changeTaskStatus = (todolistId: string, taskId: string, taskStatus: boolean) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].map(t => t.id === taskId ? {...t, isDone: taskStatus} : t)})
    }

    const changeFilter = (todolistId: string, filter: FilterValuesType) => {
        setTodolists(todolists.map(t => t.todolistId === todolistId ? {...t, filter} : t))
    }

    const removeTodolist = (todolistId: string) => {
        setTodolists(todolists.filter(t => t.todolistId !== todolistId))
        delete tasks[todolistId]
    }

    const getTaskForRender = (allTask: TaskType[], nextFiler: FilterValuesType) => {
        switch (nextFiler) {
            case 'active':
                return allTask.filter(t => !t.isDone)
            case 'completed':
                return allTask.filter(t => t.isDone)
            default:
                return allTask
        }
    }

    const addTodolist = (title:string) => {
        let newTodolistId = v1()
        let newTodolist:TodolistType = {todolistId:newTodolistId,todolistTitle:title,filter:'all'}
        setTodolists([newTodolist,...todolists])
        setTasks({
            ...tasks,
            [newTodolistId]:[]
        })
    }

    const changeTaskTitle = (todolistId:string,taskId:string,newTitle:string) => {
        setTasks({...tasks,[todolistId]:tasks[todolistId].map(task => task.id === taskId ? {...task,title:newTitle}: task)})
    }

    const changeTitleTodolist = (todolistId:string,todolistTitle:string) => {
        setTodolists(todolists.map(todolist => todolist.todolistId === todolistId ? {...todolist,todolistTitle:todolistTitle}:todolist))
    }

    const todolistComponents: JSX.Element[] = todolists.map(t => {

        const tasksForTodolist: TaskType[] = getTaskForRender(tasks[t.todolistId], t.filter)

        return (
            <Todolist
                key={t.todolistId}
                todolistId={t.todolistId}
                title={t.todolistTitle}
                filter={t.filter}
                tasks={tasksForTodolist}
                removeTask={removeTask}
                changeFilter={changeFilter}
                addTask={addTask}
                changeTaskStatus={changeTaskStatus}
                removeTodolist={removeTodolist}
                changeTaskTitle={changeTaskTitle}
                changeTitleTodolist={changeTitleTodolist}
            />
        );
    })

    // UI

    return (
        <div className="App">
            <AddItemForm addItem={addTodolist}/>
            {todolistComponents}
        </div>
    );
}

export default App;
