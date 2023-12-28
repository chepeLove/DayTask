import { RequestStatusType } from "app/appSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todoListsActions, todoListsThunks } from "features/todolistsList/model/todolists/todoListsSlice";
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk";
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
  selectors: {
    selectTask: (sliceState) => sliceState,
    filteredTasksByTodolistId: (sliceState, args) => {
      let tasksForTodoLists: TaskDomainType[] = slice.getSelectors().selectTask(sliceState)[args.todolistId];
      if (args.filter === "active") {
        tasksForTodoLists = tasksForTodoLists.filter((task) => task.status === TasksStatuses.New);
      }
      if (args.filter === "completed") {
        tasksForTodoLists = tasksForTodoLists.filter((task) => task.status === TasksStatuses.Completed);
      }
      return tasksForTodoLists;
    },
  },
});

export const setTasks = createAppAsyncThunk<{ tasks: TaskType[] }, string>(
  `${slice.name}/setTasks`,
  async (todolistId, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(todoListsActions.changeTodolistEntityStatus({ id: todolistId, status: "loading" }));
    const response = await taskApi.getTasks(todolistId);
    dispatch(todoListsActions.changeTodolistEntityStatus({ id: todolistId, status: "succeeded" }));
    return { tasks: response.data.items };
  },
);

const addTask = createAppAsyncThunk<{ task: TaskType }, { todolistId: string; title: string }>(
  `${slice.name}/addTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(todoListsActions.changeTodolistEntityStatus({ id: arg.todolistId, status: "loading" }));
    const response = await taskApi.createTask(arg);
    if (response.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(todoListsActions.changeTodolistEntityStatus({ id: arg.todolistId, status: "succeeded" }));
      const task = response.data.data.item;
      return { task };
    } else {
      dispatch(todoListsActions.changeTodolistEntityStatus({ id: arg.todolistId, status: "failed" }));
      return rejectWithValue(response.data);
    }
  },
);

export const deleteTask = createAppAsyncThunk<
  { todolistId: string; taskId: string },
  { todolistId: string; taskId: string }
>(`${slice.name}/deleteTask`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(tasksActions.changeEntityStatusTask({ todolistId: arg.todolistId, taskId: arg.taskId, status: "loading" }));
  const response = await taskApi.deleteTask(arg);
  if (response.data.resultCode === RESULT_CODE.SUCCEEDED) {
    dispatch(
      tasksActions.changeEntityStatusTask({ todolistId: arg.todolistId, taskId: arg.taskId, status: "succeeded" }),
    );
    return { todolistId: arg.todolistId, taskId: arg.taskId };
  } else {
    tasksActions.changeEntityStatusTask({ todolistId: arg.todolistId, taskId: arg.taskId, status: "failed" });
    return rejectWithValue(response.data);
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

    dispatch(
      tasksActions.changeEntityStatusTask({
        todolistId: arg.todolistId,
        taskId: arg.taskId,
        status: "loading",
      }),
    );
    const response = await taskApi.updateTask(arg.todolistId, arg.taskId, apiModel);
    if (response.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(
        tasksActions.changeEntityStatusTask({ todolistId: arg.todolistId, taskId: arg.taskId, status: "succeeded" }),
      );
      return arg;
    } else {
      dispatch(
        tasksActions.changeEntityStatusTask({ todolistId: arg.todolistId, taskId: arg.taskId, status: "failed" }),
      );
      return rejectWithValue(response.data);
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

export const tasksSelectors = slice.selectors;
