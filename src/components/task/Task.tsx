import React, {ChangeEvent} from 'react';
import {CheckBox} from "../checkbox/CheckBox";
import {Button} from "../button/Button";
import {EditableSpan} from "../editableSpan/EditableSpan";
import {useTask} from "./hooks/useTask";
import {TasksStatuses} from "../../api/api";
import {TaskDomainType} from "../../reducers/tasks-reducer";


type TaskPropsType = {
    todolistId: string
} & TaskDomainType

export const Task: React.FC<TaskPropsType> = React.memo((
        {
            todolistId,
            id,
            title,
            status,
            entityStatus
        }) => {

        const {changeTaskStatus, removeTask, changeTitleTask} = useTask(todolistId)
        const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDoneValue = e.currentTarget.checked
            changeTaskStatus(newIsDoneValue ? TasksStatuses.Completed : TasksStatuses.New, id)
        }

        const changeTitleTaskHandler = (title: string) => {
            changeTitleTask(title, id)
        }

        const removeTaskHandler = () => {
            removeTask(id)
        }

        return (
            <li key={id} className={status === TasksStatuses.Completed ? 'task-done' : 'task'}>
                <CheckBox checked={status === TasksStatuses.Completed}
                          onChangeCallback={changeTaskStatusHandler}
                          disabled={entityStatus === 'loading'}
                />
                <EditableSpan value={title}
                              onChangeTitleCallback={changeTitleTaskHandler}
                              disabled={entityStatus === 'loading'}
                />
                <Button name={'X'}
                        callBackButton={removeTaskHandler}
                        disabled={entityStatus === 'loading'}
                />
            </li>
        )
    }
)