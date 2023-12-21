import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, AppRootStateType } from "app/store";
import { BaseResponseType } from "common/types";

/**
 * Creates an asynchronous thunk with specified types for state, dispatch, and reject value.
 *
 * @template State - Type of the application state
 * @template Dispatch - Type of the dispatch function
 * @template RejectValue - Type of the reject value in case of failure
 * @returns {AsyncThunk<State, unknown, { state: State, dispatch: Dispatch, rejectValue: RejectValue | null }>}
 */

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppDispatch;
  rejectValue: BaseResponseType | null;
}>();
