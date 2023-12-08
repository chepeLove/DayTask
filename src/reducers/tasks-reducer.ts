import { RESULT_CODE, taskAPI, TaskPriorities, TasksStatuses, TaskType, UpdateTaskType } from "api/api";
import { Dispatch } from "redux";
import { AppRootStateType, AppThunk } from "store/store";
import { appActions, RequestStatusType } from "./app-reducer";
import { ErrorType, handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import axios from "axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions } from "reducers/todolists-reducer";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      state[action.payload.task.todoListId].unshift({ ...action.payload.task, entityStatus: "idle" });
    },
    removeTask: (state, action: PayloadAction<{ todolistId: string; taskId: string }>) => {
      const index = state[action.payload.todolistId].findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) {
        state[action.payload.todolistId].splice(index, 1);
      }
    },
    updateTask: (
      state,
      action: PayloadAction<{ todolistId: string; taskId: string; model: UpdateDomainTaskModelType }>,
    ) => {
      const taskForTodolist = state[action.payload.todolistId];
      const index = taskForTodolist.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) {
        taskForTodolist[index] = { ...taskForTodolist[index], ...action.payload.model };
      }
    },
    setTasks: (state, action: PayloadAction<{ tasks: TaskType[] }>) => {
      action.payload.tasks.forEach((task) => {
        state[task.todoListId].push({ ...task, entityStatus: "idle" });
      });
    },
    changeEntityStatusTask: (
      state,
      action: PayloadAction<{ todolistId: string; taskId: string; status: RequestStatusType }>,
    ) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId);
      if (task) {
        task.entityStatus = action.payload.status;
      }
    },
    clearTasksData: () => {
      return {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistsActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((todolist) => {
          state[todolist.id] = [];
        });
      })
      .addCase(todolistsActions.ddTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.id];
      });
  },
});

export const tasksReducer = tasksSlice.reducer;
export const tasksActions = tasksSlice.actions;

//Thunks
export const setTasksTC = (todolistId: string): AppThunk => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, status: "loading" }));
      const result = await taskAPI.getTasks(todolistId);
      dispatch(tasksActions.setTasks({ tasks: result.data.items }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, status: "succeeded" }));
    } catch (error) {
      if (axios.isAxiosError<ErrorType>(error)) {
        const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message;
        handleServerNetworkError(dispatch, errorMessage);
      } else {
        handleServerNetworkError(dispatch, (error as Error).message);
      }
    }
  };
};
export const createTaskTC =
  (todolistId: string, title: string): AppThunk =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, status: "loading" }));
      const result = await taskAPI.createTask(todolistId, title);
      if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(tasksActions.addTask({ task: result.data.data.item }));
      } else {
        handleServerAppError(result.data, dispatch);
      }
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, status: "succeeded" }));
    } catch (error) {
      if (axios.isAxiosError<ErrorType>(error)) {
        const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message;
        handleServerNetworkError(dispatch, errorMessage);
      } else {
        handleServerNetworkError(dispatch, (error as Error).message);
      }
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, status: "failed" }));
    }
  };
export const deleteTaskTC =
  (todolistId: string, taskId: string): AppThunk =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      dispatch(tasksActions.changeEntityStatusTask({ todolistId, taskId, status: "loading" }));
      const result = await taskAPI.deleteTask(todolistId, taskId);
      if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(tasksActions.removeTask({ todolistId, taskId }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        dispatch(tasksActions.changeEntityStatusTask({ todolistId, taskId, status: "succeeded" }));
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
export const updateTaskTC =
  (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType): AppThunk =>
  async (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find((task) => task.id === taskId);

    if (!task) {
      console.warn("task not found in the state");
      return;
    }

    const apiModel: UpdateTaskType = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      ...domainModel,
    };

    try {
      dispatch(tasksActions.changeEntityStatusTask({ todolistId, taskId, status: "loading" }));
      const result = await taskAPI.updateTask(todolistId, taskId, apiModel);
      if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(tasksActions.updateTask({ todolistId, taskId, model: domainModel }));
        dispatch(tasksActions.changeEntityStatusTask({ todolistId, taskId, status: "succeeded" }));
      } else {
        handleServerAppError(result.data, dispatch);
        dispatch(tasksActions.changeEntityStatusTask({ todolistId, taskId, status: "failed" }));
      }
    } catch (error) {
      if (axios.isAxiosError<ErrorType>(error)) {
        const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message;
        handleServerNetworkError(dispatch, errorMessage);
      } else {
        handleServerNetworkError(dispatch, (error as Error).message);
      }
      dispatch(tasksActions.changeEntityStatusTask({ todolistId, taskId, status: "failed" }));
    }
  };

//Types

export type TasksStateType = {
  [key: string]: TaskDomainType[];
};

export type TaskDomainType = TaskType & {
  entityStatus: RequestStatusType;
};

type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TasksStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
