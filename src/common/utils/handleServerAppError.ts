import { ResponseType } from "api/api";
import { appActions } from "reducers/app-reducer";
import { AppDispatch } from "store/store";

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
