import { Dispatch } from "redux";
import { RESULT_CODE, todolistAPI, TodolistType } from "api/api";
import { appActions, RequestStatusType } from "./app-reducer";
import axios from "axios";
import { ErrorType, handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { AppDispatch, AppThunk } from "store/store";
import { setTasksTC } from "./tasks-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
      action.payload.todolists.forEach((todolist) => {
        state.push({ ...todolist, filter: "all", entityStatus: "idle" });
      });
    },
    ddTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state.push({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
    },
    removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id);
      if (todolist) {
        todolist.title = action.payload.title;
      }
    },
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id);
      if (todolist) {
        todolist.filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; status: RequestStatusType }>) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id);
      if (todolist) {
        todolist.entityStatus = action.payload.status;
      }
    },
    clearTodolistsData: () => {
      return [];
    },
  },
});

export const todolistsReducer = todolistsSlice.reducer;
export const todolistsActions = todolistsSlice.actions;

//Actions

//Thunks
export const setTodolistTC = (): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const result = await todolistAPI.getTodolists();
    dispatch(todolistsActions.setTodolists({ todolists: result.data }));
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
    result.data.forEach((todolist) => {
      dispatch(setTasksTC(todolist.id));
    });
  } catch (error) {
    if (axios.isAxiosError<ErrorType>(error)) {
      const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message;
      handleServerNetworkError(dispatch, errorMessage);
    } else {
      handleServerNetworkError(dispatch, (error as Error).message);
    }
  }
};
export const createTodolistTC =
  (title: string): AppThunk =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const result = await todolistAPI.createTodolist(title);
      if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(todolistsActions.ddTodolist({ todolist: result.data.data.item }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(result.data, dispatch);
      }
    } catch (error) {
      if (axios.isAxiosError<ErrorType>(error)) {
        const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message;
        handleServerNetworkError(dispatch, errorMessage);
      } else {
        handleServerNetworkError(dispatch, (error as Error).message);
      }
    }
  };
export const deleteTodolistTC =
  (id: string): AppThunk =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      dispatch(todolistsActions.changeTodolistEntityStatus({ id, status: "loading" }));
      const result = await todolistAPI.deleteTodolist(id);
      if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(todolistsActions.removeTodolist({ id }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(result.data, dispatch);
      }
    } catch (error) {
      if (axios.isAxiosError<ErrorType>(error)) {
        const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message;
        handleServerNetworkError(dispatch, errorMessage);
      } else {
        handleServerNetworkError(dispatch, (error as Error).message);
      }
    }
  };
export const updateTodolistTitleTC =
  (id: string, title: string): AppThunk =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      dispatch(todolistsActions.changeTodolistEntityStatus({ id, status: "loading" }));
      const result = await todolistAPI.updateTodolistTitle(id, title);
      if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(todolistsActions.changeTodolistTitle({ id, title }));
        dispatch(appActions.setAppStatus({ status: "loading" }));
        dispatch(todolistsActions.changeTodolistEntityStatus({ id, status: "loading" }));
      } else {
        handleServerAppError(result.data, dispatch);
        dispatch(todolistsActions.changeTodolistEntityStatus({ id, status: "loading" }));
      }
    } catch (error) {
      if (axios.isAxiosError<ErrorType>(error)) {
        const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message;
        handleServerNetworkError(dispatch, errorMessage);
      } else {
        handleServerNetworkError(dispatch, (error as Error).message);
      }
      dispatch(todolistsActions.changeTodolistEntityStatus({ id, status: "loading" }));
    }
  };

//Types
export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
