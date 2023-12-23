import React, { useCallback, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "common/hooks/useAppSelector";
import { selectAppStatus, selectIsInitialized } from "app/appSelectors";
import { RequestStatusType } from "app/appSlice";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { authThunks } from "features/auth/model/authSlice";
import { Button, ErrorSnackbar, LinearProgress, Preloader } from "common/components";
import { Login } from "features/auth/ui/Login/Login";
import { TodolistList } from "features/todolistsList/ui/TodolistsList/TodolistList";

function App() {
  const isInitialized = useAppSelector<boolean>(selectIsInitialized);
  const status = useAppSelector<RequestStatusType>(selectAppStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authThunks.authMe());
  }, []);

  const logoutHandler = useCallback(() => {
    dispatch(authThunks.logout());
  }, []);

  if (!isInitialized) {
    return <Preloader />;
  }

  return (
    <>
      {status === "loading" && <LinearProgress />}
      <Button name={"log out"} callBackButton={logoutHandler} />
      <Routes>
        <Route path={"/login"} element={<Login />} />
        <Route path={"/"} element={<TodolistList />} />
        <Route path={"/404"} element={<h1>404: PAGE NOT FOUND</h1>} />
        <Route path={"*"} element={<Navigate to={"/404"} />} />
      </Routes>
      <ErrorSnackbar />
    </>
  );
}

export default App;
