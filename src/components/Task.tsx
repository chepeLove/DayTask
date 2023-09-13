import React, {ChangeEvent} from 'react';
import {TaskType} from "../App";
import {CheckBox} from "./CheckBox";
import {Button} from "./Button";


type TaskPropsType = {
    removeTask: () => void
    changeTaskStatus: (taskStatus: boolean) => void
} & TaskType

export const Task: React.FC<TaskPropsType> = (
    {
        id,
        title,
        isDone,
        removeTask,
        changeTaskStatus,

    }) => {


    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => changeTaskStatus(e.currentTarget.checked)

    return (
        <li key={id} className={isDone ? 'task-done' : 'task'}>
            <CheckBox checked={isDone} onChangeCallback={changeTaskStatusHandler}/>
            <span>{title}</span>
            <Button name={'X'} callBackButton={removeTask}/>
        </li>
    )
}