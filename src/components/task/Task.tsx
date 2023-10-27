import React, {ChangeEvent} from 'react';
import {CheckBox} from "../CheckBox";
import {Button} from "../Button";
import {EditableSpan} from "../editableSpan/EditableSpan";
import {TaskType} from "../../reducers/tasks-reducer";
import {useTask} from "./hooks/useTask";


type TaskPropsType = {
    todolistId: string
} & TaskType

export const Task: React.FC<TaskPropsType> = React.memo((
        {
            todolistId,
            id,
            title,
            isDone,
        }) => {

        const {changeTaskStatus,removeTask,changeTitleTask} = useTask(todolistId)
        const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => changeTaskStatus(e.currentTarget.checked,id)

        return (
            <li key={id} className={isDone ? 'task-done' : 'task'}>
                <CheckBox checked={isDone} onChangeCallback={changeTaskStatusHandler}/>
                <EditableSpan value={title} onChangeTitleCallback={(newTitle)=>changeTitleTask(newTitle,id)}/>
                <Button name={'X'} callBackButton={()=>removeTask(id)}/>
            </li>
        )
    }
)