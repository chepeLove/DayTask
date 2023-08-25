import React, {RefObject} from 'react';
import {namePropsType} from "../App";
import {Button} from "./Button";
import {Input} from "./Input";
import {v1} from "uuid";
import {useAutoAnimate} from "@formkit/auto-animate/react";


type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    title: string
    tasks: TaskType[]
    setTasks:(tasks:TaskType[])=>void
    setFilter:(name:namePropsType)=>void
    filter:string
    onChangeRef:RefObject<HTMLInputElement>
    check:boolean
    setCheck:(check:boolean)=>void
}

export function Todolist(props: PropsType) {

    const [listRef] = useAutoAnimate<HTMLUListElement>()

    const removeTask = (id:string) =>{
        props.setTasks(props.tasks.filter((task)=>task.id !== id))
    }

    const onAllClickHandler = ()=>{
        props.setFilter('All')
    }
    const onActiveClickHandler = ()=>{
        props.setFilter('Active')
    }
    const onCompletedClickHandler = ()=>{
        props.setFilter('Completed')
    }

    const removeAllTask = ()=>{
        props.setTasks([])
    }

    const addNewTask = (title:string)=>{
         let newTask = {id: v1(), title: title , isDone:props.check}
        props.setTasks([newTask,...props.tasks])
    }

    const addTask = ()=>{
        if(props.onChangeRef.current){
            addNewTask(props.onChangeRef.current.value)
            props.onChangeRef.current.value=''
        }
    }

    const callBackButton  = () => {
        addTask()
    }

    const showSelectedTasks = () => {
        let tasksFilter = props.tasks

        if(props.filter==='Active') {
            tasksFilter =  props.tasks.filter((task)=> !task.isDone)
        }

        if(props.filter==='Completed') {
            tasksFilter = props.tasks.filter((task)=> task.isDone)
        }

        return tasksFilter
    }

    return <div>
        <h3>{props.title}</h3>
        <div>
            <Input  onChangeRef={props.onChangeRef} addTask={addTask} />
            <Button name ={'+'} callBackButton={callBackButton}/>
        </div>
        <ul ref={listRef}>
            {showSelectedTasks().map((task)=>{
                const onClickHandler = () => removeTask(task.id)
                return(
                    <li key={task.id}>
                        {/*<CheckBox checked = {props.check} setCheck={props.setCheck}/>*/}
                        <input type="checkbox" checked={task.isDone}/>
                        <span>{task.title}</span>
                        <button onClick={onClickHandler}>x</button>
                    </li>
                )
            })}
        </ul>
        <button onClick={removeAllTask}>DELETE ALL TASKS</button>
        <div>
            <button onClick={onAllClickHandler}>All</button>
            <button onClick={onActiveClickHandler}>Active</button>
            <button onClick={onCompletedClickHandler}>Completed</button>
        </div>
    </div>
}
