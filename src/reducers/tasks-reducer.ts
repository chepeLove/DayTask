import {
  AddTodolistACType,
  changeTodolistEntityStatusAC,
  ClearTodolistsDataACType,
  RemoveTodolistACType,
  SetTodolistsACType,
} from "./todolists-reducer";
import { RESULT_CODE, taskAPI, TaskPriorities, TasksStatuses, TaskType, UpdateTaskType } from "../api/api";
import { Dispatch } from "redux";
import { AppRootStateType, AppThunk } from "../store/store";
import { RequestStatusType, setAppStatusAC } from "./app-reducer";
import { ErrorType, handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import axios from "axios";

const initialState: TasksStateType = {};

export const TasksReducer = (state = initialState, action: TasksActionsType): TasksStateType => {
  switch (action.type) {
    case "SET-TASKS": {
      return {
        ...state,
        [action.payload.todolistId]: action.payload.tasks.map((task) => ({ ...task, entityStatus: "idle" })),
      };
    }
    case "ADD-TASK": {
      const newTask: TaskDomainType = { ...action.payload.task, entityStatus: "idle" };
      return { ...state, [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]] };
    }
    case "REMOVE-TASK": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter((t) => t.id !== action.payload.taskId),
      };
    }
    case "UPDATE-TASK": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map((task) =>
          task.id === action.payload.taskId ? { ...task, ...action.payload.model } : task,
        ),
      };
    }
    case "ADD-TODOLIST": {
      return { ...state, [action.payload.todolist.id]: [] };
    }
    case "REMOVE-TODOLIST": {
      const {
        [action.payload.id]: [],
        ...rest
      } = state;
      return rest;
    }
    case "SET-TODOLISTS": {
      return action.payload.todolists.reduce(
        (copyState, el) => {
          copyState[el.id] = [];
          return copyState;
        },
        { ...state },
      );
    }
    case "CHANGE-ENTITY-STATUS": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map((task) =>
          task.id === action.payload.taskId ? { ...task, entityStatus: action.payload.status } : task,
        ),
      };
    }
    case "CLEAR-TODOLISTS-DATA": {
      return {};
    }
    default: {
      return state;
    }
  }
};

//Actions
export const addTaskAC = (todolistId: string, task: TaskType) =>
  ({ type: "ADD-TASK", payload: { todolistId, task } }) as const;
export const removeTaskAC = (todolistId: string, taskId: string) =>
  ({ type: "REMOVE-TASK", payload: { todolistId, taskId } }) as const;
export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) =>
  ({ type: "UPDATE-TASK", payload: { todolistId, taskId, model } }) as const;
export const setTasksAC = (todolistId: string, tasks: TaskType[]) =>
  ({ type: "SET-TASKS", payload: { tasks, todolistId } }) as const;
export const changeTaskEntityStatusAC = (todolistId: string, taskId: string, status: RequestStatusType) =>
  ({ type: "CHANGE-ENTITY-STATUS", payload: { todolistId, taskId, status } }) as const;

//Thunks
export const setTasksTC = (todolistId: string): AppThunk => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(setAppStatusAC("loading"));
      dispatch(changeTodolistEntityStatusAC(todolistId, "loading"));
      const result = await taskAPI.getTasks(todolistId);
      dispatch(setTasksAC(todolistId, result.data.items));
      dispatch(setAppStatusAC("succeeded"));
      dispatch(changeTodolistEntityStatusAC(todolistId, "succeeded"));
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
      dispatch(setAppStatusAC("loading"));
      dispatch(changeTodolistEntityStatusAC(todolistId, "loading"));
      const result = await taskAPI.createTask(todolistId, title);
      if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(addTaskAC(todolistId, result.data.data.item));
      } else {
        handleServerAppError(result.data, dispatch);
      }
      dispatch(setAppStatusAC("succeeded"));
      dispatch(changeTodolistEntityStatusAC(todolistId, "succeeded"));
    } catch (error) {
      if (axios.isAxiosError<ErrorType>(error)) {
        const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message;
        handleServerNetworkError(dispatch, errorMessage);
      } else {
        handleServerNetworkError(dispatch, (error as Error).message);
      }
      dispatch(changeTodolistEntityStatusAC(todolistId, "failed"));
    }
  };
export const deleteTaskTC =
  (todolistId: string, taskId: string): AppThunk =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(setAppStatusAC("loading"));
      dispatch(changeTaskEntityStatusAC(todolistId, taskId, "loading"));
      const result = await taskAPI.deleteTask(todolistId, taskId);
      if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(removeTaskAC(todolistId, taskId));
        dispatch(setAppStatusAC("succeeded"));
        dispatch(changeTaskEntityStatusAC(todolistId, taskId, "succeeded"));
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
      dispatch(changeTaskEntityStatusAC(todolistId, taskId, "loading"));
      const result = await taskAPI.updateTask(todolistId, taskId, apiModel);
      if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(updateTaskAC(todolistId, taskId, domainModel));
        dispatch(changeTaskEntityStatusAC(todolistId, taskId, "succeeded"));
      } else {
        handleServerAppError(result.data, dispatch);
        dispatch(changeTaskEntityStatusAC(todolistId, taskId, "failed"));
      }
    } catch (error) {
      if (axios.isAxiosError<ErrorType>(error)) {
        const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message;
        handleServerNetworkError(dispatch, errorMessage);
      } else {
        handleServerNetworkError(dispatch, (error as Error).message);
      }
      dispatch(changeTaskEntityStatusAC(todolistId, taskId, "failed"));
    }
  };

//Types

export type TasksStateType = {
  [key: string]: TaskDomainType[];
};

export type TaskDomainType = TaskType & {
  entityStatus: RequestStatusType;
};

type TasksActionsType =
  | AddTaskACType
  | RemoveTaskACType
  | ChangeTaskStatusACType
  | AddTodolistACType
  | RemoveTodolistACType
  | SetTasksAC
  | SetTodolistsACType
  | ChangeTaskEntityStatusACType
  | ClearTodolistsDataACType;

type AddTaskACType = ReturnType<typeof addTaskAC>;
type RemoveTaskACType = ReturnType<typeof removeTaskAC>;
type ChangeTaskStatusACType = ReturnType<typeof updateTaskAC>;
type SetTasksAC = ReturnType<typeof setTasksAC>;
type ChangeTaskEntityStatusACType = ReturnType<typeof changeTaskEntityStatusAC>;

type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TasksStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
