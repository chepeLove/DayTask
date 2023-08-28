import React, {ChangeEvent, } from 'react';
import {namePropsType} from "../App";
import {Button} from "./Button";
import {Input} from "./Input";
import {v1} from "uuid";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {CheckBox} from "./CheckBox";


type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
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
        let task = props.tasks.find(t => t.id === id)
        if (task) {
            task.isDone = isDone
            props.setTasks([...props.tasks])
        }
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

    return <div>
        <h3>{props.name}</h3>
        <div>
            <Input addTask={addTask} setTitle={props.setTitle} title={props.title} setError={props.setError} error={props.error}/>
            <Button name={'+'} callBackButton={callBackButton}/>
            {props.error && <div className='error-message'>{props.error}</div>}
        </div>
        <ul ref={listRef}>
            {showSelectedTasks().map((task) => {
                const onClickHandler = () => removeTask(task.id)
                const onChangeCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
                    let newIsDoneValue = event.currentTarget.checked
                    changeTaskStatus(task.id, newIsDoneValue)
                }
                return (
                    <li key={task.id} className={task.isDone ? 'is-done':''}>
                        <CheckBox checked={task.isDone} onChange={onChangeCheckBox}/>
                        <span>{task.title}</span>
                        <button onClick={onClickHandler}>x</button>
                    </li>
                )
            })}
        </ul>
        <button onClick={removeAllTask}>DELETE ALL TASKS</button>
        <div>
            <button className={props.filter ==='All'? 'active-filter':''} onClick={onAllClickHandler}>All</button>
            <button className={props.filter ==='Active'? 'active-filter':''} onClick={onActiveClickHandler}>Active</button>
            <button className={props.filter ==='Completed'? 'active-filter':''} onClick={onCompletedClickHandler}>Completed</button>
        </div>
    </div>
}
