import React, { useCallback } from "react";
import s from "./Header.module.css";
import { Button } from "common/components/Button/Button";
import { authSelectors, authThunks } from "features/auth/model/authSlice";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import logoProject from "../../../assets/icons/logoProject.svg";
import { useAppSelector } from "common/hooks/useAppSelector";

export const Header = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(authSelectors.selectLogin);

  const logoutHandler = useCallback(() => {
    dispatch(authThunks.logout());
  }, []);

  return (
    <header className={s.header}>
      <div>
        <img src={logoProject} alt="logo" />
        <h1>
          Day<span className={s.name}>Task</span>
        </h1>
      </div>
      <div>
        <span>{userData.login}</span>
        <Button name={"log out"} callBackButton={logoutHandler} />
      </div>
    </header>
  );
};
