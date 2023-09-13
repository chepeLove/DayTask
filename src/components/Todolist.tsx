import React, {ChangeEvent, useState, KeyboardEvent} from 'react';
import {Task} from './Task';
import {FilterValuesType, TaskType} from "../App";
import {Input} from "./Input";
import {Button} from "./Button";


type PropsType = {
    todolistId: string
    title: string
    filter: FilterValuesType
    tasks: Array<TaskType>
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, taskStatus: boolean) => void
    removeTodolist: (todolistId: string) => void
}

export const Todolist: React.FC<PropsType> = (
    {
        todolistId,
        title,
        filter,
        tasks,
        removeTask,
        changeFilter,
        addTask,
        changeTaskStatus,
        removeTodolist
    }) => {

    const [value, setValue] = useState('')

    const [error, setError] = useState<string | null>(null)

    const changeFilterOnClickHandlerCreator = (nextFilter: FilterValuesType) => {
        return () => changeFilter(todolistId, nextFilter)
    }

    const tasksList: JSX.Element =
        tasks.length
            ? <ul>
                {tasks.map(t => {
                    const removeTaskCallback = () => {
                        removeTask(todolistId, t.id)
                    }
                    const changeTaskStatusCallback = (isDone: boolean) => {
                        changeTaskStatus(todolistId, t.id, isDone)
                    }
                    return (
                        <Task
                            key={t.id}
                            {...t}
                            removeTask={removeTaskCallback}
                            changeTaskStatus={changeTaskStatusCallback}
                        />
                    )
                })}
            </ul>
            : <span>Your task list is empty</span>


    const isAddTaskPossible = !value


    const addTaskHandler = () => {

        if (value.trim()) {
            addTask(todolistId, value.trim())
        } else {
            setError('Please, enter text')
        }

        setValue('')

    }
    const onClickAddTAskHandler = () => {
        !isAddTaskPossible &&
        addTaskHandler()
    }

    const onChangeSetValueHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
    }

    const onKeyDownSetValueHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        error && setError(null)
        e.key === 'Enter' && addTaskHandler()
    }


    const removeTodolistHandler = () => {
        removeTodolist(todolistId)
    }

    return <div className="todolist">
        <div>
            <Button name= {'X'} callBackButton={removeTodolistHandler}/>
            <h3>{title}</h3>
        </div>
        <div>
            <Input
                value={value}
                onChangeCallback={onChangeSetValueHandler}
                onKeyDownCallback={onKeyDownSetValueHandler}
                error={error}
            />
            <Button name={'+'} callBackButton={onClickAddTAskHandler} disabled={isAddTaskPossible}/>
            {error && <div className="error-message">{error}</div>}
        </div>
        {tasksList}
        <div>
            <Button className={filter === 'all' ? 'btn-filter-active' : 'btn-filter'}
                    name={'All'}
                    callBackButton={changeFilterOnClickHandlerCreator('all')}
            />
            <Button className={filter === 'active' ? 'btn-filter-active' : 'btn-filter'}
                    name={'Active'}
                    callBackButton={changeFilterOnClickHandlerCreator('active')}
            />
            <Button className={filter === 'completed' ? 'btn-filter-active' : 'btn-filter'}
                    name={'Completed'}
                    callBackButton={changeFilterOnClickHandlerCreator('completed')}
            />
        </div>
    </div>
}
