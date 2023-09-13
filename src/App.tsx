import React, {useState} from 'react';
import './App.css';
import {Todolist} from './components/Todolist';
import {v1} from "uuid";

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

    const [todolist, setTodolist] = useState<TodolistType[]>([
        {todolistId: todolistId1, todolistTitle: 'What to learn', filter: 'all'},
        {todolistId: todolistId2, todolistTitle: 'What to buy', filter: 'all'}
    ])

    const [tasks, setTasks] = useState<TasksStateType>({
        [todolistId1]: [
            {id: crypto.randomUUID(), title: 'HTML&CSS', isDone: true},
            {id: crypto.randomUUID(), title: 'JS', isDone: true},
            {id: crypto.randomUUID(), title: 'ReactJS', isDone: false},
            {id: crypto.randomUUID(), title: 'Rest API', isDone: false},
            {id: crypto.randomUUID(), title: 'GraphQL', isDone: false},
        ],
        [todolistId2]: [
            {id: crypto.randomUUID(), title: 'Beer', isDone: true},
            {id: crypto.randomUUID(), title: 'Fish', isDone: true},
            {id: crypto.randomUUID(), title: 'Nuts', isDone: false}
        ]

    });
    //CRUD:

    const addTask = (todolistId: string, taskTitle: string) => {
        const newTask: TaskType = {
            id: crypto.randomUUID(),
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
        setTodolist(todolist.map(t => t.todolistId === todolistId ? {...t, filter} : t))
    }

    const changeTaskTitle = (todolistId: string, title: string) => {
        setTodolist(todolist.map(t => t.todolistId === todolistId ? {...t, title} : t))
    }

    const removeTodolist = (todolistId: string) => {
        setTodolist(todolist.filter(t => t.todolistId !== todolistId))
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

    const todolistComponents: JSX.Element[] = todolist.map(t => {

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
            />
        );
    })

    // UI

    return (
        <div className="App">
            {todolistComponents}
        </div>
    );
}

export default App;
