import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { todoListsActions } from "features/todolistsList/model/todolists/todoListsSlice";
import { tasksActions } from "features/todolistsList/model/tasks/tasksSlice";
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk";
import { LoginParamsType, userData } from "features/auth/api/authApi.types";
import { authAPI } from "features/auth/api/authApi";
import { RESULT_CODE } from "common/enums";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    login: {} as userData,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(authThunks.login.fulfilled, authThunks.logout.fulfilled, authThunks.authMe.fulfilled),
        (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
          state.isLoggedIn = action.payload.isLoggedIn;
        },
      )
      .addMatcher(isAnyOf(authThunks.authMe.fulfilled), (state, action: PayloadAction<{ userData: userData }>) => {
        state.login = action.payload.userData;
      });
  },
  selectors: {
    selectIsLoggedIn: (sliceState) => sliceState.isLoggedIn,
    selectLogin: (sliceState) => sliceState.login,
  },
});

//Thunks

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  `${slice.name}/login`,
  async (arg, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const response = await authAPI.login(arg);
    console.log(response.data);
    if (response.data.resultCode === RESULT_CODE.SUCCEEDED) {
      return { isLoggedIn: true };
    } else {
      return rejectWithValue(response.data);
    }
  },
);

const authMe = createAppAsyncThunk<{ isLoggedIn: boolean; userData: userData }, undefined>(
  `${slice.name}/me`,
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const response = await authAPI.me();
    if (response.data.resultCode === RESULT_CODE.SUCCEEDED) {
      return { isLoggedIn: true, userData: response.data.data };
    } else {
      return rejectWithValue(response.data);
    }
  },
);

export const logout = createAppAsyncThunk<
  {
    isLoggedIn: boolean;
  },
  undefined
>(`${slice.name}/logout`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const response = await authAPI.logout();
  if (response.data.resultCode === RESULT_CODE.SUCCEEDED) {
    dispatch(todoListsActions.clearTodoListsData());
    dispatch(tasksActions.clearTasksData());
    return { isLoggedIn: false };
  } else {
    return rejectWithValue(response.data);
  }
});

export const authSlice = slice.reducer;
export const authThunks = { login, authMe, logout };
export const authSelectors = slice.selectors;
