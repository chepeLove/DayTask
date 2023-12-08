import {
  createTodolistTC,
  deleteTodolistTC,
  FilterValuesType,
  setTodolistTC,
  TodolistDomainType,
  todolistsActions,
  updateTodolistTitleTC,
} from "reducers/todolists-reducer";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks/hooks";

export const useTodolist = () => {
  const todolist = useAppSelector<TodolistDomainType[]>((state) => state.todolists);
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
