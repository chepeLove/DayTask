import { todoListsSlice } from "features/todolistsList/model/todolists/todoListsSlice";
import { tasksSlice } from "features/todolistsList/model/tasks/tasksSlice";
import { appSlice } from "app/appSlice";
import { authSlice } from "features/auth/model/authSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    tasks: tasksSlice,
    todoLists: todoListsSlice,
    app: appSlice,
    auth: authSlice,
  },
});

export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// @ts-ignore
window.store = store;
