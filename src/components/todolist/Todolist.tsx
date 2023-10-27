import React from 'react';
import {Task} from '../task/Task';
import {Button} from "../Button";
import {AddItemForm} from "../addItemForm/AddItemForm";
import {EditableSpan} from "../EditableSpan";
import {TaskType} from "../../reducers/tasks-reducer";
import {TodolistType} from "../../reducers/todolists-reducer";
import {useTodolist} from "./hooks/useTodolist";
import {useTask} from "../task/hooks/useTask";


type PropsType = {
    todolist: TodolistType
}

export const Todolist: React.FC<PropsType> = React.memo(({todolist}) => {

        const {todolistId, todolistTitle, filter} = todolist

        const {removeTodolist,changeTitleTodolist,changeFilterTodolist} = useTodolist()

        const {tasks,getTaskForRender,addTask}=useTask(todolistId)

        const tasksForTodolist: TaskType[] = getTaskForRender(tasks, filter)

        const tasksList: JSX.Element =
            tasks.length
                ? <ul>
                    {tasksForTodolist.map(task => {
                        return (
                            <Task
                                key={task.id}
                                todolistId = {todolistId}
                                {...task}
                            />
                        )
                    })}
                </ul>
                : <span>Your task list is empty</span>

        return <div className="todolist">
            <div>
                <Button name={'X'} callBackButton={()=>removeTodolist(todolistId)}/>
                <h3>
                    <EditableSpan value={todolistTitle} onChangeTitleCallback={()=>changeTitleTodolist(todolistId,todolistTitle)}/>
                </h3>
            </div>
            <div>
                <AddItemForm addItem={(title) =>addTask(title)}/>
            </div>
            {tasksList}
            <div>
                <Button className={filter === 'all' ? 'btn-filter-active' : 'btn-filter'}
                        name={'All'}
                        callBackButton={() => changeFilterTodolist(todolistId,'all')}
                />
                <Button className={filter === 'active' ? 'btn-filter-active' : 'btn-filter'}
                        name={'Active'}
                        callBackButton={() => changeFilterTodolist(todolistId,'active')}
                />
                <Button className={filter === 'completed' ? 'btn-filter-active' : 'btn-filter'}
                        name={'Completed'}
                        callBackButton={() => changeFilterTodolist(todolistId,'completed')}
                />
            </div>
        </div>
    }
)
