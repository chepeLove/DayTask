import { FilterValuesType, TodolistDomainType, todolistsActions, todoListsThunks } from "reducers/todolists-reducer";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks/hooks";
import { selectTodolists } from "components/todolist/todolist-selectors";

export const useTodolist = () => {
  const todolist = useAppSelector<TodolistDomainType[]>(selectTodolists);
  const dispatch = useAppDispatch();

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(todoListsThunks.addTodolist({ title }));
    },
    [dispatch],
  );

  const deleteTodolist = useCallback(
    (id: string) => {
      dispatch(todoListsThunks.deleteTodolist({ id }));
    },
    [dispatch],
  );

  const updateTodolistTitle = useCallback(
    (id: string, title: string) => {
      dispatch(todoListsThunks.updateTodolistTitle({ id, title }));
    },
    [dispatch],
  );

  const changeFilterTodolist = useCallback(
    (id: string, filter: FilterValuesType) => {
      dispatch(todolistsActions.changeTodolistFilter({ id, filter }));
    },
    [dispatch],
  );

  return {
    todolist,
    addTodolist,
    removeTodolist: deleteTodolist,
    changeTitleTodolist: updateTodolistTitle,
    changeFilterTodolist,
  };
};
