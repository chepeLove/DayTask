import { AnyAction } from "redux";
import { todolistsSlice } from "features/todolistsList/model/todolists/todolistsSlice";
import { tasksSlice } from "features/todolistsList/model/tasks/tasksSlice";
import { ThunkAction } from "redux-thunk";
import { appSlice } from "app/appSlice";
import { authSlice } from "features/auth/model/authSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    tasks: tasksSlice,
    todolists: todolistsSlice,
    app: appSlice,
    auth: authSlice,
  },
});

export type AppRootStateType = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>;

export type AppDispatch = typeof store.dispatch;

// @ts-ignore
window.store = store;
