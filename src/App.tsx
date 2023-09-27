import React, {useReducer} from 'react';
import './App.css';
import {Todolist} from './components/Todolist';
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm";
import {
    addTodolistAC,
    changeFilterAC,
    changeTitleTodolistAC,
    removeTodolistAC,
    TodolistReducer
} from "./reducers/TodolistReducer";
import {
    addTaskAC,
    addTaskInNewTodolistAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    TaskReducer
} from "./reducers/TaskReducer";

export type FilterValuesType = 'all'|'active'|'completed'

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type TodolistType = {
    todolistId: string
    todolistTitle: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [todolistId: string]: TaskType[]
}

function App() {

    //BLL:

    const todolistId1 = v1()
    const todolistId2 = v1()

    const [todolist, dispatchTodolist] = useReducer(TodolistReducer,[
        {todolistId: todolistId1, todolistTitle: 'What to learn', filter: 'all'},
        {todolistId: todolistId2, todolistTitle: 'What to buy', filter: 'all'}
    ])

    const [tasks, dispatchTasks] = useReducer(TaskReducer,{
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
      dispatchTasks(addTaskAC(todolistId,taskTitle))
    }

    function removeTask(todolistId: string, taskId: string) {
        dispatchTasks(removeTaskAC(todolistId,taskId))
    }

    const changeTaskStatus = (todolistId: string, taskId: string, taskStatus: boolean) => {
        dispatchTasks(changeTaskStatusAC(todolistId,taskId,taskStatus))
    }

    const changeFilter = (todolistId: string, filter: FilterValuesType) => {
        dispatchTodolist(changeFilterAC(todolistId,filter))
    }

    const removeTodolist = (todolistId: string) => {
        dispatchTodolist(removeTodolistAC(todolistId))
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
       dispatchTodolist(addTodolistAC(title,newTodolistId))
        dispatchTasks(addTaskInNewTodolistAC(newTodolistId))
    }

    const changeTaskTitle = (todolistId:string,taskId:string,newTitle:string) => {
       dispatchTasks(changeTaskTitleAC(todolistId,taskId,newTitle))
    }

    const changeTitleTodolist = (todolistId:string,todolistTitle:string) => {
        dispatchTodolist(changeTitleTodolistAC(todolistId,todolistTitle))
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
