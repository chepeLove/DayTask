import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks/hooks";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { appActions } from "reducers/app-reducer";

export const ErrorSnackbar = () => {
  const errorMessage = useAppSelector((state) => state.app.error);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(appActions.setAppError({ error: null }));
    }
  }, [errorMessage]);

  return <ToastContainer theme="colored" autoClose={3000} position="bottom-center" />;
};
