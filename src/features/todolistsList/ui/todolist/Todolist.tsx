import React from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { TodolistDomainType } from "features/todolistsList/model/todolists/todolistsSlice";
import { useTodolist } from "features/todolistsList/ui/todolist/hooks/useTodolist";
import { useTask } from "features/todolistsList/ui/todolist/tasks/task/hooks/useTask";
import s from "features/todolistsList/ui/todolist/Todolist.module.css";
import { FilterTasksButtons } from "features/todolistsList/ui/todolist/filterTasksButton/FilterTasksButtons";
import { Tasks } from "features/todolistsList/ui/todolist/tasks/Tasks";
import { TodolistTitle } from "features/todolistsList/ui/todolist/todolistTitle/TodolistTitle";

type TodolistPropsType = {
  todolist: TodolistDomainType;
};

export const Todolist: React.FC<TodolistPropsType> = React.memo(({ todolist }) => {
  const { id, title, filter, entityStatus } = todolist;

  const { removeTodolist, changeTitleTodolist, changeFilterTodolist } = useTodolist();

  const { addTask } = useTask(id);

  return (
    <div className={s.todolist}>
      <TodolistTitle
        id={id}
        title={title}
        entityStatus={entityStatus}
        changeTitleTodolist={changeTitleTodolist}
        removeTodolist={removeTodolist}
      />
      <div>
        <AddItemForm addItem={addTask} disabled={todolist.entityStatus === "loading"} />
      </div>
      <Tasks todolistId={id} filter={filter} />
      <div>
        <FilterTasksButtons todolistId={id} filter={filter} changeFilterTodolist={changeFilterTodolist} />
      </div>
    </div>
  );
});
