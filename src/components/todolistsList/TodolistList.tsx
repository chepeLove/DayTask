import React, { useEffect } from "react";
import { useTodolist } from "../todolist/hooks/useTodolist";
import { useAppDispatch, useAppSelector } from "store/hooks/hooks";
import { Todolist } from "../todolist/Todolist";
import { AddItemForm } from "../addItemForm/AddItemForm";
import { Navigate } from "react-router-dom";
import s from "./TodolistsList.module.css";
import { RequestStatusType } from "reducers/app-reducer";
import { setTodolistTC } from "reducers/todolists-reducer";

export const TodolistList = () => {
  const { todolist, addTodolist } = useTodolist();
  const isLoggedIn = useAppSelector<boolean>((state) => state.auth.isLoggedIn);
  const status = useAppSelector<RequestStatusType>((state) => state.app.status);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(setTodolistTC());
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
