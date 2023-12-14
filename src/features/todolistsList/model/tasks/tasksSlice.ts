import { appActions, RequestStatusType } from "app/appSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions, todoListsThunks } from "features/todolistsList/model/todolists/todolistsSlice";
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk";
import { handleServerAppError, handleServerNetworkError } from "common/utils";
import { taskApi, TaskType, UpdateTaskType } from "features/todolistsList/api/tasksApi";
import { RESULT_CODE, TaskPriorities, TasksStatuses } from "common/enums";

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
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
      .addCase(todoListsThunks.setTodoLists.fulfilled, (state, action) => {
        action.payload.todoLists.forEach((todolist) => {
          state[todolist.id] = [];
        });
      })
      .addCase(todoListsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todoListsThunks.deleteTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(setTasks.fulfilled, (state, action) => {
        action.payload.tasks.forEach((task) => {
          state[task.todoListId].push({ ...task, entityStatus: "idle" });
        });
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift({ ...action.payload.task, entityStatus: "idle" });
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const index = state[action.payload.todolistId].findIndex((task) => task.id === action.payload.taskId);
        if (index !== -1) {
          state[action.payload.todolistId].splice(index, 1);
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const taskForTodolist = state[action.payload.todolistId];
        const index = taskForTodolist.findIndex((task) => task.id === action.payload.taskId);
        if (index !== -1) {
          taskForTodolist[index] = { ...taskForTodolist[index], ...action.payload.domainModel };
        }
      });
  },
});

export const setTasks = createAppAsyncThunk<{ tasks: TaskType[] }, string>(
  `${slice.name}/setTasks`,
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, status: "loading" }));
      const result = await taskApi.getTasks(todolistId);
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, status: "succeeded" }));
      return { tasks: result.data.items };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const addTask = createAppAsyncThunk<{ task: TaskType }, { todolistId: string; title: string }>(
  `${slice.name}/addTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.todolistId, status: "loading" }));
      const result = await taskApi.createTask(arg.todolistId, arg.title);
      if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.todolistId, status: "succeeded" }));
        return { task: result.data.data.item };
      } else {
        handleServerAppError(result.data, dispatch);
        dispatch(appActions.setAppStatus({ status: "failed" }));
        dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.todolistId, status: "failed" }));
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      dispatch(appActions.setAppStatus({ status: "failed" }));
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.todolistId, status: "failed" }));
      return rejectWithValue(null);
    }
  },
);

export const deleteTask = createAppAsyncThunk<
  { todolistId: string; taskId: string },
  { todolistId: string; taskId: string }
>(`${slice.name}/deleteTask`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(
      tasksActions.changeEntityStatusTask({ todolistId: arg.todolistId, taskId: arg.taskId, status: "loading" }),
    );
    const result = await taskApi.deleteTask(arg.todolistId, arg.taskId);
    if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(
        tasksActions.changeEntityStatusTask({ todolistId: arg.todolistId, taskId: arg.taskId, status: "succeeded" }),
      );
      return { todolistId: arg.todolistId, taskId: arg.taskId };
    } else {
      handleServerAppError(result.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

export const updateTask = createAppAsyncThunk<UpdateTaskArgsType, UpdateTaskArgsType>(
  `${slice.name}/updateTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;

    const task = getState().tasks[arg.todolistId].find((task) => task.id === arg.taskId);

    if (!task) {
      console.warn("task not found in the state");
      return rejectWithValue(null);
    }

    const apiModel: UpdateTaskType = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      ...arg.domainModel,
    };

    try {
      dispatch(
        tasksActions.changeEntityStatusTask({ todolistId: arg.todolistId, taskId: arg.taskId, status: "loading" }),
      );
      const result = await taskApi.updateTask(arg.todolistId, arg.taskId, apiModel);
      if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(
          tasksActions.changeEntityStatusTask({ todolistId: arg.todolistId, taskId: arg.taskId, status: "succeeded" }),
        );
        return { todolistId: arg.todolistId, taskId: arg.taskId, domainModel: arg.domainModel };
      } else {
        handleServerAppError(result.data, dispatch);
        dispatch(
          tasksActions.changeEntityStatusTask({ todolistId: arg.todolistId, taskId: arg.taskId, status: "failed" }),
        );
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      dispatch(
        tasksActions.changeEntityStatusTask({ todolistId: arg.todolistId, taskId: arg.taskId, status: "failed" }),
      );
      return rejectWithValue(null);
    }
  },
);

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

type UpdateTaskArgsType = {
  taskId: string;
  domainModel: UpdateDomainTaskModelType;
  todolistId: string;
};

export const tasksSlice = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { setTasks, addTask, deleteTask, updateTask };
