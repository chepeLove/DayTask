import { useFormik } from "formik";
import React from "react";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "features/auth/model/authSelectors";
import { authThunks } from "features/auth/model/authSlice";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { useAppSelector } from "common/hooks/useAppSelector";
import { BaseResponseType } from "common/types";

type FormikErrorType = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};

export const Login = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: FormikErrorType = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 8) {
        errors.password = "Password must contain at least 8 characters";
      } else if (!/[a-zA-Z]/.test(values.password)) {
        errors.password = "The password must contain at least one letter";
      } else if (!/\d/.test(values.password)) {
        errors.password = "The password must contain at least one number";
      } else if (!/[A-Z]/.test(values.password)) {
        errors.password = "The password must contain at least one capital letter";
      } else if (!/[a-z]/.test(values.password)) {
        errors.password = "The password must contain at least one lowercase letter";
      } else if (/[^a-zA-Z0-9]/.test(values.password)) {
        errors.password = "Password must not contain symbols";
      }

      return errors;
    },
    onSubmit: (values, formikHelpers) => {
      dispatch(authThunks.login({ loginParams: values }))
        .unwrap()
        .catch((errorData: BaseResponseType) => {
          errorData.fieldsErrors?.forEach((el) => formikHelpers.setFieldError(el.field, el.error));
        });
    },
  });

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
