import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as null | string,
    isInitialized: false,
  },
  reducers: {
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setAppInitialize: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;

//Thunks

//Types

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

export type InitialStateType = {
  status: RequestStatusType;
  error: string | null;
  isInitialized: boolean;
};
