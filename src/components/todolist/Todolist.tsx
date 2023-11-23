import React from 'react';
import {Task} from '../task/Task';
import {Button} from "../button/Button";
import {AddItemForm} from "../addItemForm/AddItemForm";
import {EditableSpan} from "../editableSpan/EditableSpan";
import {TodolistDomainType} from "../../reducers/todolists-reducer";
import {useTodolist} from "./hooks/useTodolist";
import {useTask} from "../task/hooks/useTask";
import {TaskType} from "../../api/api";


type PropsType = {
    todolist: TodolistDomainType
}

export const Todolist: React.FC<PropsType> = React.memo(({todolist}) => {

        const {id, title, filter} = todolist

        const {removeTodolist,changeTitleTodolist,changeFilterTodolist} = useTodolist()


        const {tasks,getTaskForRender,addTask}=useTask(id)

        const tasksForTodolist: TaskType[] = getTaskForRender(tasks, filter)

        const tasksList: JSX.Element =
            tasks.length ?
                <ul>
                    {tasksForTodolist?.map(task => {
                        return (
                            <Task
                                key={task.id}
                                todolistId = {id}
                                {...task}
                            />
                        )
                    })}
                </ul>
                :
    <span>Your task list is empty</span>

        return <div className="todolist">
            <div>
                <Button name={'X'} callBackButton={()=>removeTodolist(id)}/>
                <h3>
                    <EditableSpan value={title} onChangeTitleCallback={(title)=>changeTitleTodolist(id,title)}/>
                </h3>
            </div>
            <div>
                <AddItemForm addItem={(title) =>addTask(title)} disabled={todolist.entityStatus==='loading'}/>
            </div>
            {tasksList}
            <div>
                <Button className={filter === 'all' ? 'btn-filter-active' : 'btn-filter'}
                        name={'All'}
                        callBackButton={() => changeFilterTodolist(id,'all')}
                />
                <Button className={filter === 'active' ? 'btn-filter-active' : 'btn-filter'}
                        name={'Active'}
                        callBackButton={() => changeFilterTodolist(id,'active')}
                />
                <Button className={filter === 'completed' ? 'btn-filter-active' : 'btn-filter'}
                        name={'Completed'}
                        callBackButton={() => changeFilterTodolist(id,'completed')}
                />
            </div>
        </div>
    }
)
