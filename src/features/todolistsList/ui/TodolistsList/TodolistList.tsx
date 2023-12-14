import React, { useEffect } from "react";
import { useTodolist } from "features/todolistsList/ui/todolist/hooks/useTodolist";
import { Todolist } from "features/todolistsList/ui/todolist/Todolist";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Navigate } from "react-router-dom";
import s from "features/todolistsList/ui/TodolistsList/TodolistsList.module.css";
import { RequestStatusType } from "app/appSlice";
import { selectIsLoggedIn } from "features/auth/model/authSelectors";
import { selectAppStatus } from "app/appSelectors";
import { todoListsThunks } from "features/todolistsList/model/todolists/todolistsSlice";
import { useAppSelector } from "common/hooks/useAppSelector";
import { useAppDispatch } from "common/hooks/useAppDispatch";

export const TodolistList = () => {
  const { todolist, addTodolist } = useTodolist();
  const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn);
  const status = useAppSelector<RequestStatusType>(selectAppStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(todoListsThunks.setTodoLists());
    }
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  const todolistComponents = todolist.map((todolist) => <Todolist key={todolist.id} todolist={todolist} />);

  return (
    <>
      <div className={s.list}>
        <AddItemForm addItem={addTodolist} disabled={status === "loading"} />
        {todolistComponents}
      </div>
    </>
  );
};
