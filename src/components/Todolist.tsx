import React from 'react';
import {namePropsType} from "../App";
import {Button} from "./Button";
import Input from "./Input";

type TaskType = {
    id: number
    title: string
    isDone: boolean
}

type PropsType = {
    title: string
    tasks: TaskType[]
    setTasks:(tasks:TaskType[])=>void
    setFilter:(name:namePropsType)=>void
    filter:string
    titleInput:string
    setTitleInput:(titleInput:string)=>void
}

export function Todolist(props: PropsType) {

    const removeTask = (id:number) =>{
        props.setTasks(props.tasks.filter((task)=>task.id !== id))
    }

    const filterTask = (name:namePropsType) =>{
        props.setFilter(name)
    }

    const removeAllTask = ()=>{
        props.setTasks([])
    }

    const addNewTask = (titleInput:string)=>{
         let newTask = {id: (props.tasks.length + 1), title: titleInput , isDone: false}
        props.setTasks([...props.tasks,newTask])
    }

    const callBackButton  = () => {
        addNewTask(props.titleInput)
        props.setTitleInput('')
    }


    const showSelectedTasks = () => {
        let tasksFilter = props.tasks

        if(props.filter==='Active') {
            tasksFilter =  props.tasks.filter((task)=> !task.isDone)
        }

        if(props.filter==='Completed') {
            tasksFilter = props.tasks.filter((task)=> task.isDone)
        }

        if(props.filter === 'The first three') {
            tasksFilter = props.tasks.filter((task)=> task.id <=3 )
        }

        return tasksFilter
    }



    return <div>
        <h3>{props.title}</h3>
        <div>
            <Input titleInput={props.titleInput} setTitleInput={props.setTitleInput} />
            <Button name ={'+'} titleInput={props.titleInput} callBackButton={callBackButton}/>
        </div>
        <ul>
            {showSelectedTasks().map((task)=>{
                return(
                    <li key={task.id}>
                        <input type="checkbox" checked={task.isDone}/>
                        <span>{task.title}</span>
                        <button onClick={()=>{removeTask(task.id)}}>x</button>
                    </li>
                )
            })}
        </ul>
        <button onClick={removeAllTask}>DELETE ALL TASKS</button>
        <div>
            <button onClick={()=>{filterTask('All')}}>All</button>
            <button onClick={()=>{filterTask('Active')}}>Active</button>
            <button onClick={()=>{filterTask('Completed')}}>Completed</button>
            <button onClick={()=>{filterTask('The first three')}}>The first three</button>
        </div>
    </div>
}
