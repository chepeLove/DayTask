import React, {ChangeEvent} from 'react';
import {CheckBox} from "./CheckBox";
import {Button} from "./Button";
import {EditableSpan} from "./EditableSpan";
import {TaskType} from "../reducers/tasks-reducer";


type TaskPropsType = {
    removeTask: () => void
    changeTaskStatus: (taskStatus: boolean) => void
    changeTitleCallback: (newTitle: string) => void
} & TaskType

export const Task: React.FC<TaskPropsType> = React.memo((
        {
            id,
            title,
            isDone,
            removeTask,
            changeTaskStatus,
            changeTitleCallback,
        }) => {


        const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => changeTaskStatus(e.currentTarget.checked)

        return (
            <li key={id} className={isDone ? 'task-done' : 'task'}>
                <CheckBox checked={isDone} onChangeCallback={changeTaskStatusHandler}/>
                <EditableSpan value={title} onChangeTitleCallback={changeTitleCallback}/>
                <Button name={'X'} callBackButton={removeTask}/>
            </li>
        )
    }
)