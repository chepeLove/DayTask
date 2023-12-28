import React, { useCallback, useEffect } from "react";
import { Todolist } from "features/todolistsList/ui/todolist/Todolist";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Navigate } from "react-router-dom";
import s from "features/todolistsList/ui/TodolistsList/TodolistsList.module.css";
import { appSelectors, RequestStatusType } from "app/appSlice";
import {
  TodolistDomainType,
  todoListsSelectors,
  todoListsThunks,
} from "features/todolistsList/model/todolists/todoListsSlice";
import { useAppSelector } from "common/hooks/useAppSelector";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { selectIsLoggedIn } from "features/auth/model/authSlice";

export const TodolistList = () => {
  const todoLists = useAppSelector<TodolistDomainType[]>(todoListsSelectors.selectTodoLists);
  const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn);
  const status = useAppSelector<RequestStatusType>(appSelectors.selectAppStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(todoListsThunks.setTodoLists());
    }
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      return dispatch(todoListsThunks.addTodolist({ title })).unwrap();
    },
    [dispatch],
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  const todolistComponents = todoLists.map((todolist) => <Todolist key={todolist.id} todolist={todolist} />);

  return (
    <>
      <div className={s.list}>
        <AddItemForm addItem={addTodolist} disabled={status === "loading"} />
        {todolistComponents}
      </div>
    </>
  );
};
