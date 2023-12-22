import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
  todoListsThunks,
} from "features/todolistsList/model/todolists/todolistsSlice";
import { useCallback } from "react";
import { selectTodolists } from "features/todolistsList/ui/todolist/todolist-selectors";
import { useAppSelector } from "common/hooks/useAppSelector";
import { useAppDispatch } from "common/hooks/useAppDispatch";

export const useTodolist = () => {
  const todolist = useAppSelector<TodolistDomainType[]>(selectTodolists);
  const dispatch = useAppDispatch();

  const addTodolist = useCallback(
    (title: string) => {
      return dispatch(todoListsThunks.addTodolist({ title })).unwrap();
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
