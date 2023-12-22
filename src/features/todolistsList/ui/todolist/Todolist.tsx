import React from "react";
import { Task } from "features/todolistsList/ui/todolist/task/Task";
import { Button } from "common/components/Button/Button";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { TodolistDomainType } from "features/todolistsList/model/todolists/todolistsSlice";
import { useTodolist } from "features/todolistsList/ui/todolist/hooks/useTodolist";
import { useTask } from "features/todolistsList/ui/todolist/task/hooks/useTask";
import { TaskDomainType } from "features/todolistsList/model/tasks/tasksSlice";
import s from "features/todolistsList/ui/todolist/Todolist.module.css";
import { FilterTasksButtons } from "features/todolistsList/ui/todolist/task/filterTasksButton/FilterTasksButtons";

type TodolistPropsType = {
  todolist: TodolistDomainType;
};

export const Todolist: React.FC<TodolistPropsType> = React.memo(({ todolist }) => {
  const { id, title, filter, entityStatus } = todolist;

  const { removeTodolist, changeTitleTodolist, changeFilterTodolist } = useTodolist();

  const { tasks, getTaskForRender, addTask } = useTask(id);

  const tasksForTodolist: TaskDomainType[] = getTaskForRender(tasks, filter);

  const tasksList = tasks.length ? (
    <ul>
      {tasksForTodolist?.map((task) => {
        return <Task key={task.id} todolistId={id} {...task} />;
      })}
    </ul>
  ) : (
    <ul>
      <li>
        <span>Your task list is empty</span>
      </li>
    </ul>
  );

  return (
    <div className={s.todolist}>
      <div>
        <Button name={"X"} callBackButton={() => removeTodolist(id)} disabled={entityStatus === "loading"} />
        <h3>
          <EditableSpan
            value={title}
            onChangeTitleCallback={(title) => changeTitleTodolist(id, title)}
            disabled={entityStatus === "loading"}
          />
        </h3>
      </div>
      <div>
        <AddItemForm addItem={(title) => addTask(title)} disabled={todolist.entityStatus === "loading"} />
      </div>
      {tasksList}
      <div>
        <FilterTasksButtons todolistId={id} filter={filter} changeFilterTodolist={changeFilterTodolist} />
      </div>
    </div>
  );
});
