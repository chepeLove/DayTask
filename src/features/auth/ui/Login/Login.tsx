import React from "react";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "features/auth/model/authSelectors";
import { useAppSelector } from "common/hooks/useAppSelector";
import { useLogin } from "features/auth/lib/useLogin";

export const Login = () => {
  const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn);
  const { formik } = useLogin();

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <label>
        <p>
          To log in get registered
          <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
            {" "}
            here
          </a>
        </p>
        <p>or use common test account credentials:</p>
        <p>Email: free@samuraijs.com</p>
        <p>Password: free</p>
      </label>

      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input id={"email"} type="email" {...formik.getFieldProps("email")} />
        {formik.touched.email && formik.errors.email && <div style={{ color: "red" }}>{formik.errors.email}</div>}

        <label htmlFor="password">Password:</label>
        <input id={"password"} type="password" {...formik.getFieldProps("password")} />
        {formik.touched.password && formik.errors.password && (
          <div style={{ color: "red" }}>{formik.errors.password}</div>
        )}

        <label htmlFor="rememberMe">
          <input
            type="checkbox"
            id={"rememberMe"}
            checked={formik.values.rememberMe}
            {...formik.getFieldProps("rememberMe")}
          />
          <span>remember me</span>
        </label>
        <button type={"submit"}>Log in</button>
      </form>
    </>
  );
};
