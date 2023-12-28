import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "common/hooks/useAppSelector";
import { useLogin } from "features/auth/lib/useLogin";
import s from "../Login/Login.module.css";
import { authSelectors } from "features/auth/model/authSlice";

export const Login = () => {
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);
  const { formik } = useLogin();

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <form className={s.login} onSubmit={formik.handleSubmit}>
        <label className={s.label} htmlFor="email">
          Email:
        </label>
        <input className={s.inputForm} id={"email"} type="email" {...formik.getFieldProps("email")} />
        {formik.touched.email && formik.errors.email && <div style={{ color: "red" }}>{formik.errors.email}</div>}

        <label className={s.label} htmlFor="password">
          Password:
        </label>
        <input className={s.inputForm} id={"password"} type="password" {...formik.getFieldProps("password")} />
        {formik.touched.password && formik.errors.password && (
          <div style={{ color: "red" }}>{formik.errors.password}</div>
        )}

        <label className={s.label} htmlFor="rememberMe">
          <input
            type="checkbox"
            id={"rememberMe"}
            checked={formik.values.rememberMe}
            {...formik.getFieldProps("rememberMe")}
          />
          <span>remember me</span>
        </label>
        <button className={s.buttonForm} type={"submit"}>
          Log in
        </button>
      </form>
    </>
  );
};
