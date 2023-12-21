import { appActions } from "app/appSlice";
import { AppDispatch } from "app/store";
import { BaseResponseType } from "common/types";

/**
 This function handles errors that may occur during server interactions.
 @param {ResponseType<D>} data - The server response in the format of ResponseType<D>.
 @param {function} dispatch - The function to dispatch messages to the Redux store.
 @param {boolean} showError - A flag indicating whether to display errors in the user interface.
 */

export const handleServerAppError = <D>(
  data: BaseResponseType<D>,
  dispatch: AppDispatch,
  showError: boolean = true,
) => {
  if (showError) {
    dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
