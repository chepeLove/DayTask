import { ResponseType } from "api/api";
import { Dispatch } from "redux";
import { appActions } from "reducers/app-reducer";

export type ErrorType = {
  statusCode: number;
  messages: string[];
  error: string;
};

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setAppError({ error: "Some error occurred" }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};

export const handleServerNetworkError = (dispatch: Dispatch, error: string) => {
  dispatch(appActions.setAppError({ error: error ? error : "Some error occurred" }));
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
