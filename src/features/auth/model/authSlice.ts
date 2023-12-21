import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/appSlice";
import { todolistsActions } from "features/todolistsList/model/todolists/todolistsSlice";
import { tasksActions } from "features/todolistsList/model/tasks/tasksSlice";
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk";
import { handleServerAppError, handleServerNetworkError } from "common/utils";
import { LoginParamsType } from "features/auth/api/authApi.types";
import { authAPI } from "features/auth/api/authApi";
import { RESULT_CODE } from "common/enums";

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
      .addCase(authMe.fulfilled, (state, action) => {
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

export const authMe = createAppAsyncThunk<{ isLoggedIn: boolean }>(`${slice.name}/me`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const result = await authAPI.me();
    if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: true };
    } else {
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
}>(`${slice.name}/logout`, async (_, thunkAPI) => {
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

export const authSlice = slice.reducer;
export const authThunks = { login, me: authMe, logout };

//Types
