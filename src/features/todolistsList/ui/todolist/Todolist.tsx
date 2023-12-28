import React, { useCallback } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import {
  FilterValuesType,
  TodolistDomainType,
  todoListsActions,
  todoListsThunks,
} from "features/todolistsList/model/todolists/todoListsSlice";
import s from "features/todolistsList/ui/todolist/Todolist.module.css";
import { FilterTasksButtons } from "features/todolistsList/ui/todolist/filterTasksButton/FilterTasksButtons";
import { Tasks } from "features/todolistsList/ui/todolist/tasks/Tasks";
import { TodolistTitle } from "features/todolistsList/ui/todolist/todolistTitle/TodolistTitle";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { tasksThunks } from "features/todolistsList/model/tasks/tasksSlice";

type TodolistPropsType = {
  todolist: TodolistDomainType;
};

export const Todolist: React.FC<TodolistPropsType> = React.memo(({ todolist }) => {
  const { id, title, filter, entityStatus } = todolist;
  const dispatch = useAppDispatch();

  const deleteTodolist = useCallback(
    (id: string) => {
      dispatch(todoListsThunks.deleteTodolist({ id }));
    },
    [id],
  );

  const updateTodolistTitle = useCallback(
    (id: string, title: string) => {
      dispatch(todoListsThunks.updateTodolistTitle({ id, title }));
    },
    [title],
  );

  const changeFilterTodolist = useCallback(
    (id: string, filter: FilterValuesType) => {
      dispatch(todoListsActions.changeTodolistFilter({ id, filter }));
    },
    [filter],
  );

  const addTask = useCallback(
    (taskTitle: string) => {
      return dispatch(tasksThunks.addTask({ todolistId: id, title: taskTitle })).unwrap();
    },
    [dispatch],
  );

  return (
    <div className={s.todolist}>
      <TodolistTitle
        id={id}
        title={title}
        entityStatus={entityStatus}
        updateTodolistTitle={updateTodolistTitle}
        deleteTodolist={deleteTodolist}
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
