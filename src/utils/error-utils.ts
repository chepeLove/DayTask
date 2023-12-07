import { setAppErrorAC, setAppStatusAC } from "../reducers/app-reducer";
import { ResponseType } from "../api/api";
import { Dispatch } from "redux";

export type ErrorType = {
  statusCode: number;
  messages: string[];
  error: string;
};

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC(data.messages[0]));
  } else {
    dispatch(setAppErrorAC("Some error occurred"));
  }
  dispatch(setAppStatusAC("failed"));
};

export const handleServerNetworkError = (dispatch: Dispatch, error: string) => {
  dispatch(setAppErrorAC(error ? error : "Some error occurred"));
  dispatch(setAppStatusAC("failed"));
};
