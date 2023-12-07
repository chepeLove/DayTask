import { Dispatch } from "redux";
import { AppThunk } from "../store/store";
import { authAPI, LoginParamsType, RESULT_CODE } from "../api/api";
import { setAppInitializedAC, setAppStatusAC } from "./app-reducer";
import axios from "axios";
import { ErrorType, handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import { clearTodolistsDataAC } from "./todolists-reducer";

const initialState: InitialStateType = {
  isLoggedIn: false,
};

export const AuthReducer = (state = initialState, action: LoginActionsType) => {
  switch (action.type) {
    case "login/SET-IS-LOGGED-IN": {
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
      };
    }
    default: {
      return state;
    }
  }
};

//Actions

export const setIsLoggedIn = (isLoggedIn: boolean) =>
  ({ type: "login/SET-IS-LOGGED-IN", payload: { isLoggedIn } }) as const;

//Thunks

export const loginTC =
  (loginParams: LoginParamsType): AppThunk =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(setAppStatusAC("loading"));
      const result = await authAPI.login(loginParams);
      if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(setAppStatusAC("succeeded"));
        dispatch(setIsLoggedIn(true));
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
    dispatch(setAppStatusAC("loading"));
    const result = await authAPI.me();
    if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(setIsLoggedIn(true));
      dispatch(setAppStatusAC("succeeded"));
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
    dispatch(setAppInitializedAC(true));
  }
};

export const logoutTC = (): AppThunk => async (dispatch: Dispatch) => {
  try {
    dispatch(setAppStatusAC("loading"));
    const result = await authAPI.logout();
    if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(clearTodolistsDataAC());
      dispatch(setAppStatusAC("succeeded"));
      dispatch(setIsLoggedIn(false));
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

type InitialStateType = {
  isLoggedIn: boolean;
};

type LoginActionsType = SetIsLoggedInType;

type SetIsLoggedInType = ReturnType<typeof setIsLoggedIn>;
