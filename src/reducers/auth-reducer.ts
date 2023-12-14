import { authAPI, LoginParamsType, RESULT_CODE } from "api/api";
import { handleServerAppError } from "utils/handleServerAppError";
import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "reducers/app-reducer";
import { todolistsActions } from "reducers/todolists-reducer";
import { tasksActions } from "reducers/tasks-reducer";
import { handleServerNetworkError } from "utils/handleServerNetworkError";
import { createAppAsyncThunk } from "utils/createAppAsyncThunk";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(me.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

//Thunks

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, { loginParams: LoginParamsType }>(
  `${slice}/login`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const result = await authAPI.login(arg.loginParams);
      if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: true };
      } else {
        handleServerAppError(result.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const me = createAppAsyncThunk<{ isLoggedIn: boolean }>(`${slice.name}/me`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const result = await authAPI.me();
    if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: true };
    } else {
      handleServerAppError(result.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppInitialize({ isInitialized: true }));
  }
});

export const logout = createAppAsyncThunk<{
  isLoggedIn: boolean;
}>(`${slice.name}/logout`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const result = await authAPI.logout();
    if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(todolistsActions.clearTodolistsData());
      dispatch(tasksActions.clearTasksData());
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: false };
    } else {
      handleServerAppError(result.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;

export const authThunks = { login, me, logout };

//Types
