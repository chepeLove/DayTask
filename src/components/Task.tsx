import React, {ChangeEvent} from 'react';
import {TaskType} from "./Todolist";
import {CheckBox} from "./CheckBox";

type TaskPropsType = {
    removeTask: (taskId: string) => void
    changeTaskStatus: (taskId: string,newIsDone:boolean) => void
} & TaskType
export const Task = (props:TaskPropsType) => {
    const onClickHandler = () => props.removeTask(props.id)
    const onChangeCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = event.currentTarget.checked
        props.changeTaskStatus(props.id, newIsDoneValue)
    }
    return (
        <li key={props.id} className={props.isDone ? 'is-done':''}>
            <CheckBox checked={props.isDone} onChange={onChangeCheckBox}/>
            <span>{props.title}</span>
            <button onClick={onClickHandler}>x</button>
        </li>
    )
};