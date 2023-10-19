import React  from 'react';
import {Task} from './Task';
import {Button} from "./Button";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, TaskType} from "../reducers/tasks-reducer";
import {
    changeFilterAC,
    changeTitleTodolistAC,
    FilterValuesType,
    removeTodolistAC,
    TodolistType
} from "../reducers/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../store/store";


type PropsType = {
    todolist: TodolistType
}

export const Todolist: React.FC<PropsType> = ({todolist}) => {

    const {todolistId,todolistTitle,filter} = todolist

    const tasks = useSelector<AppRootStateType,TaskType[]>(state => state.tasks[todolistId])
    const dispatch = useDispatch()

    const removeTodolist = () => {
        let action = removeTodolistAC(todolistId)
        dispatch(action)
    }

    const changeTitleTodolist = () => {
        dispatch(changeTitleTodolistAC(todolistId,todolistTitle))
    }

    const getTaskForRender = (tasks: TaskType[], filter: FilterValuesType) => {
        switch (filter) {
            case 'active':
                return tasks.filter(t => !t.isDone)
            case 'completed':
                return tasks.filter(t => t.isDone)
            default:
                return tasks
        }
    }
    const tasksForTodolist: TaskType[] = getTaskForRender(tasks,filter)

    const tasksList: JSX.Element =
        tasks.length
            ? <ul>
                {tasksForTodolist.map(t => {
                    const removeTaskCallback = () => {
                        dispatch(removeTaskAC(todolistId,t.id))
                    }
                    const changeTaskStatusCallback = (isDone: boolean) => {
                        dispatch(changeTaskStatusAC(todolistId,t.id,isDone))
                    }

                    const changeTitleTaskHandler = (newTitle:string) => {
                        dispatch(changeTaskTitleAC(todolistId,t.id,newTitle))
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

    return <div className="todolist">
        <div>
            <Button name={'X'} callBackButton={removeTodolist}/>
            <h3>
                <EditableSpan value={todolistTitle} onChangeTitleCallback={changeTitleTodolist}/>
            </h3>
        </div>
        <div>
            <AddItemForm addItem={(title)=> dispatch(addTaskAC(todolistId,title))}/>
        </div>
        {tasksList}
        <div>
            <Button className={filter === 'all' ? 'btn-filter-active' : 'btn-filter'}
                    name={'All'}
                    callBackButton={()=> dispatch(changeFilterAC(todolistId,'all'))}
            />
            <Button className={filter === 'active' ? 'btn-filter-active' : 'btn-filter'}
                    name={'Active'}
                    callBackButton={() => dispatch(changeFilterAC(todolistId,'active'))}
            />
            <Button className={filter === 'completed' ? 'btn-filter-active' : 'btn-filter'}
                    name={'Completed'}
                    callBackButton={() => dispatch(changeFilterAC(todolistId,'completed'))}
            />
        </div>
    </div>
}
