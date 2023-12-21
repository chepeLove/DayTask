import { appActions } from "app/appSlice";
import axios from "axios";
import { AppDispatch } from "app/store";

/**
 * Handles network error and updates the application state.
 *
 * @param {unknown} err - The error object
 * @param {AppDispatch} dispatch - Function to dispatch application state updates
 * @returns {void}
 */

export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch): void => {
  let errorMessage = "Some error occurred";

  if (axios.isAxiosError(err)) {
    errorMessage = err.response?.data?.message || err?.message || errorMessage;
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`;
  } else {
    errorMessage = JSON.stringify(err);
  }

  dispatch(appActions.setAppError({ error: errorMessage }));
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
