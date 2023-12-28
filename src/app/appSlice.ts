import { createSlice, isAnyOf, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import { tasksThunks } from "features/todolistsList/model/tasks/tasksSlice";
import { todoListsThunks } from "features/todolistsList/model/todolists/todoListsSlice";
import { authThunks } from "features/auth/model/authSlice";

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as null | string,
    isInitialized: false,
  },
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state) => {
        state.status = "loading";
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = "succeeded";
      })
      .addMatcher(isRejected, (state, action: AnyAction) => {
        state.status = "failed";
        if (action.payload) {
          if (
            action.type === todoListsThunks.addTodolist.rejected.type ||
            action.type === tasksThunks.addTask.rejected.type ||
            action.type === authThunks.authMe.rejected.type
          )
            return;
          state.error = action.payload.messages[0];
        } else {
          state.error = action.error.message ? action.error.message : "Some error occurred";
        }
      })
      .addMatcher(isAnyOf(authThunks.authMe.fulfilled, authThunks.authMe.rejected), (state) => {
        state.isInitialized = true;
      });
  },
  selectors: {
    selectIsInitialized: (sliceState) => sliceState.isInitialized,
    selectAppStatus: (sliceState) => sliceState.status,
  },
});

export const appSlice = slice.reducer;
export const appActions = slice.actions;
export const { selectIsInitialized, selectAppStatus } = slice.selectors;

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

export type InitialStateType = {
  status: RequestStatusType;
  error: string | null;
  isInitialized: boolean;
};
