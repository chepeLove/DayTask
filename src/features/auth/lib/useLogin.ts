import { useAppDispatch } from "common/hooks/useAppDispatch";
import { useFormik } from "formik";
import { authThunks } from "features/auth/model/authSlice";
import { BaseResponseType } from "common/types";

type FormikErrorType = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};

export const useLogin = () => {
  const dispatch = useAppDispatch();

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
      dispatch(authThunks.login(values))
        .unwrap()
        .catch((errorData: BaseResponseType) => {
          errorData.fieldsErrors?.forEach((el) => formikHelpers.setFieldError(el.field, el.error));
        });
    },
  });

  return {
    formik,
  };
};
