import React, {ChangeEvent} from 'react';
import {CheckBox} from "../CheckBox";
import {Button} from "../Button";
import {EditableSpan} from "../editableSpan/EditableSpan";
import {useTask} from "./hooks/useTask";
import {TasksStatuses, TaskType} from "../../api/api";


type TaskPropsType = {
    todolistId: string
} & TaskType

export const Task: React.FC<TaskPropsType> = React.memo((
        {
            todolistId,
            id,
            title,
            status,
        }) => {

        const {changeTaskStatus,removeTask,changeTitleTask} = useTask(todolistId)
        const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDoneValue =e.currentTarget.checked
                changeTaskStatus(newIsDoneValue ? TasksStatuses.Completed : TasksStatuses.New,id)
        }

        return (
            <li key={id} className={status === TasksStatuses.Completed ? 'task-done' : 'task'}>
                <CheckBox checked={status === TasksStatuses.Completed} onChangeCallback={changeTaskStatusHandler}/>
                <EditableSpan value={title} onChangeTitleCallback={(title)=>changeTitleTask(title,id)}/>
                <Button name={'X'} callBackButton={()=>removeTask(id)}/>
            </li>
        )
    }
)