import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { AppDispatch, AppRootStateType } from "app/store";
import { thunkTryCatch } from "common/utils/thunkTryCatch";
import { BaseResponseType } from "common/types";

/**
 * Creates a thunk action that wraps an asynchronous promise.
 *
 * @template A - The type of the argument passed to the promise.
 * @template R - The type of the result returned by the promise.
 * @template T - The type of the transformed result (optional).
 *
 * @param promise - The asynchronous function to be executed.
 * @param transformPromise - Optional function to transform the promise result.
 *
 * @returns ThunkAction - The thunk action.
 */

export const createThunkAction = <A, R, T>(promise: (arg: A) => Promise<R>, transformPromise?: (arg: R) => T) => {
  return (arg: A, thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponseType>) => {
    return thunkTryCatch(thunkAPI, () => promise(arg).then(transformPromise));
  };
};
