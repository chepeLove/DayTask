import {
  createTodolistTC,
  deleteTodolistTC,
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
  updateTodolistTitleTC,
} from "reducers/todolists-reducer";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks/hooks";
import { selectTodolists } from "components/todolist/todolist-selectors";

export const useTodolist = () => {
  const todolist = useAppSelector<TodolistDomainType[]>(selectTodolists);
  const dispatch = useAppDispatch();

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(createTodolistTC(title));
    },
    [dispatch],
  );

  const removeTodolist = useCallback(
    (todolistId: string) => {
      let thunk = deleteTodolistTC(todolistId);
      dispatch(thunk);
    },
    [dispatch],
  );

  const changeTitleTodolist = useCallback(
    (id: string, title: string) => {
      dispatch(updateTodolistTitleTC(id, title));
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
    removeTodolist,
    changeTitleTodolist,
    changeFilterTodolist,
  };
};
