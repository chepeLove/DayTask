import { Dispatch } from "redux";
import { AppThunk } from "store/store";
import { authAPI, LoginParamsType, RESULT_CODE } from "api/api";
import axios from "axios";
import { ErrorType, handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "reducers/app-reducer";
import { todolistsActions } from "reducers/todolists-reducer";
import { tasksActions } from "reducers/tasks-reducer";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;

//Thunks

export const loginTC =
  (loginParams: LoginParamsType): AppThunk =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const result = await authAPI.login(loginParams);
      if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
      } else {
        handleServerAppError(result.data, dispatch);
      }
    } catch (error) {
      if (axios.isAxiosError<ErrorType>(error)) {
        const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message;
        handleServerNetworkError(dispatch, errorMessage);
      } else {
        handleServerNetworkError(dispatch, (error as Error).message);
      }
    }
  };

export const meTC = (): AppThunk => async (dispatch: Dispatch) => {
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const result = await authAPI.me();
    if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    } else {
      handleServerAppError(result.data, dispatch);
    }
  } catch (error) {
    if (axios.isAxiosError<ErrorType>(error)) {
      const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message;
      handleServerNetworkError(dispatch, errorMessage);
    } else {
      handleServerNetworkError(dispatch, (error as Error).message);
    }
  } finally {
    dispatch(appActions.setAppInitialize({ isInitialized: true }));
  }
};

export const logoutTC = (): AppThunk => async (dispatch: Dispatch) => {
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const result = await authAPI.logout();
    if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(todolistsActions.clearTodolistsData());
      dispatch(tasksActions.clearTasksData());
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
    } else {
      handleServerAppError(result.data, dispatch);
    }
  } catch (error) {
    if (axios.isAxiosError<ErrorType>(error)) {
      const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message;
      handleServerNetworkError(dispatch, errorMessage);
    } else {
      handleServerNetworkError(dispatch, (error as Error).message);
    }
  }
};

//Types
