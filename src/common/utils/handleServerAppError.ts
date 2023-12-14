import { appActions } from "app/appSlice";
import { AppDispatch } from "app/store";
import { ResponseType } from "common/types";

export type ErrorType = {
  statusCode: number;
  messages: string[];
  error: string;
};

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: AppDispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setAppError({ error: "Some error occurred" }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
