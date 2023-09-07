import React, {ChangeEvent, } from 'react';
import {namePropsType} from "../App";
import {Button} from "./Button";
import {Input} from "./Input";
import {v1} from "uuid";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {CheckBox} from "./CheckBox";
import {Task} from "./Task";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type PropsType = {
    title: string
    setTitle: (title: string) => void
    name: string
    tasks: TaskType[]
    setTasks: (tasks: TaskType[]) => void
    setFilter: (name: namePropsType) => void
    filter: string
    check: boolean
    setCheck: (check: boolean) => void
    error:string | null
    setError:(error:string | null)=>void
}

export function Todolist(props: PropsType) {

    const [listRef] = useAutoAnimate<HTMLUListElement>()

    const removeTask = (id: string) => {
        props.setTasks(props.tasks.filter((task) => task.id !== id))
    }

    const onAllClickHandler = () => {
        props.setFilter('All')
    }
    const onActiveClickHandler = () => {
        props.setFilter('Active')
    }
    const onCompletedClickHandler = () => {
        props.setFilter('Completed')
    }

    const removeAllTask = () => {
        props.setTasks([])
    }

    const addNewTask = (title: string) => {
        let newTask = {id: v1(), title: title, isDone: props.check}
        props.setTasks([newTask, ...props.tasks])

    }

    const addTask = () => {
        if (props.title.trim() !== '') {
            addNewTask(props.title.trim())
            props.setTitle('')
        }else{
            props.setError('Title is required')
        }
    }

    const callBackButton = () => {
        addTask()
    }


    const changeTaskStatus = (id: string, isDone: boolean) => {
        props.setTasks(props.tasks.map(el=>el.id===id ?{...el,isDone:isDone}:el))
    }

    const showSelectedTasks = () => {
        let tasksFilter = props.tasks

        if (props.filter === 'Active') {
            tasksFilter = props.tasks.filter((task) => !task.isDone)
        }

        if (props.filter === 'Completed') {
            tasksFilter = props.tasks.filter((task) => task.isDone)
        }

        return tasksFilter
    }

    const tasksComponent = props.tasks.length ?
        <ul ref={listRef}>
            {showSelectedTasks().map((task) => <Task {...task} removeTask={removeTask} changeTaskStatus={changeTaskStatus}/>
            )}
        </ul> : <div><span>You have not added tasks yet</span></div>

    return <div>
        <h3>{props.name}</h3>
        <div>
            <Input addTask={addTask} setTitle={props.setTitle} title={props.title} setError={props.setError} error={props.error}/>
            <Button name={'+'} callBackButton={callBackButton}/>
            {props.error && <div className='error-message'>{props.error}</div>}
        </div>
        {tasksComponent}
        <button onClick={removeAllTask}>DELETE ALL TASKS</button>
        <div>
            <button className={props.filter ==='All'? 'active-filter':''} onClick={onAllClickHandler}>All</button>
            <button className={props.filter ==='Active'? 'active-filter':''} onClick={onActiveClickHandler}>Active</button>
            <button className={props.filter ==='Completed'? 'active-filter':''} onClick={onCompletedClickHandler}>Completed</button>
        </div>
    </div>
}
