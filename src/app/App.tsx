import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "common/hooks/useAppSelector";
import { appSelectors, RequestStatusType } from "app/appSlice";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { authSelectors, authThunks } from "features/auth/model/authSlice";
import { ErrorSnackbar, LinearProgress, Preloader } from "common/components";
import { Login } from "features/auth/ui/Login/Login";
import { TodolistList } from "features/todolistsList/ui/TodolistsList/TodolistList";
import s from "./App.module.css";
import { Header } from "common/components/Header/Header";

function App() {
  const isInitialized = useAppSelector<boolean>(appSelectors.selectIsInitialized);
  const status = useAppSelector<RequestStatusType>(appSelectors.selectAppStatus);
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authThunks.authMe());
  }, []);

  if (!isInitialized) {
    return <Preloader />;
  }

  return (
    <div className={s.app}>
      {isLoggedIn && <Header />}
      {status === "loading" && <LinearProgress />}
      <Routes>
        <Route path={"/login"} element={<Login />} />
        <Route path={"/"} element={<TodolistList />} />
        <Route path={"/404"} element={<h1>404: PAGE NOT FOUND</h1>} />
        <Route path={"*"} element={<Navigate to={"/404"} />} />
      </Routes>
      <ErrorSnackbar />
    </div>
  );
}

export default App;
