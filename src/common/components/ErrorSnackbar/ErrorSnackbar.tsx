import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { appActions } from "app/appSlice";
import { useAppSelector } from "common/hooks/useAppSelector";
import { useAppDispatch } from "common/hooks/useAppDispatch";

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
