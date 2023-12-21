import { AppDispatch, AppRootStateType } from "app/store";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { BaseResponseType } from "common/types";
import { appActions } from "app/appSlice";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";

/**
 * This function is used to wrap asynchronous logic with try-catch error handling for thunks.
 * @template T - The type of the result returned by the logic function.
 * @param {BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponseType>} thunkAPI - The base ThunkAPI object.
 * @param {function(): Promise<T>} logic - The asynchronous logic function to be executed.
 * @returns {Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>>} - The promise that resolves to the result of the logic function or a rejection value.
 */

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponseType>,
  logic: () => Promise<T>,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    return await logic();
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppStatus({ status: "idle" }));
  }
};
