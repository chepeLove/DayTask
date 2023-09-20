import React  from 'react';
import {Task} from './Task';
import {FilterValuesType, TaskType} from "../App";
import {Button} from "./Button";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";


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
    changeTaskTitle:(todolistId1:string,taskId:string,newTitle:string) => void
    changeTitleTodolist:(todolistId:string,todolistTitle:string) => void
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
        removeTodolist,
        changeTaskTitle,
        changeTitleTodolist
    }) => {

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

                    const changeTitleTaskHandler = (newTitle:string) => {
                        changeTaskTitle(todolistId,t.id,newTitle)
                    }
                    return (
                        <Task
                            key={t.id}
                            {...t}
                            removeTask={removeTaskCallback}
                            changeTaskStatus={changeTaskStatusCallback}
                            changeTitleCallback={changeTitleTaskHandler}
                        />
                    )
                })}
            </ul>
            : <span>Your task list is empty</span>


    const addTaskTodolist = (title: string) => {
        addTask(todolistId,title)
    }

    const removeTodolistHandler = () => {
        removeTodolist(todolistId)
    }

    const changeTitleTodolistHandler = (newTitle:string) => {
        changeTitleTodolist(todolistId,newTitle)
    }

    return <div className="todolist">
        <div>
            <Button name={'X'} callBackButton={removeTodolistHandler}/>
            <h3>
                <EditableSpan value={title} onChangeTitleCallback={changeTitleTodolistHandler}/>
            </h3>
        </div>
        <div>
            <AddItemForm addItem={addTaskTodolist}/>
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
