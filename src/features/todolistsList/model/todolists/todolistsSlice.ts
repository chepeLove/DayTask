import { RequestStatusType } from "app/appSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tasksThunks } from "features/todolistsList/model/tasks/tasksSlice";
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk";
import { TodolistType } from "features/todolistsList/api/todolistsApi/todolistsApi.types";
import { todolistsAPI } from "features/todolistsList/api/todolistsApi/todolistsApi";
import { RESULT_CODE } from "common/enums";

const slice = createSlice({
  name: "todoLists",
  initialState: [] as TodolistDomainType[],
  reducers: {
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
  extraReducers: (builder) => {
    builder
      .addCase(setTodoLists.fulfilled, (state, action) => {
        action.payload.todoLists.forEach((todoList) => {
          state.push({ ...todoList, filter: "all", entityStatus: "idle" });
        });
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
      })
      .addCase(deleteTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id);
        if (index !== -1) {
          state.splice(index, 1);
        }
      })
      .addCase(updateTodolistTitle.fulfilled, (state, action) => {
        const todolist = state.find((todolist) => todolist.id === action.payload.id);
        if (todolist) {
          todolist.title = action.payload.title;
        }
      });
  },
});

//Thunks

export const setTodoLists = createAppAsyncThunk<{
  todoLists: TodolistType[];
}>(`${slice.name}/setTodoLists`, async (_, thunkAPI) => {
  const { dispatch } = thunkAPI;
  const response = await todolistsAPI.getTodolists();
  response.data.forEach((todolist) => {
    dispatch(tasksThunks.setTasks(todolist.id));
  });
  return { todoLists: response.data };
});

export const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>(
  `${slice.name}/addTodolist`,
  async (arg, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const response = await todolistsAPI.createTodolist(arg.title);
    if (response.data.resultCode === RESULT_CODE.SUCCEEDED) {
      return { todolist: response.data.data.item };
    } else {
      return rejectWithValue(response.data);
    }
  },
);
export const deleteTodolist = createAppAsyncThunk<{ id: string }, { id: string }>(
  `${slice.name}/deleteTodolist`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.id, status: "loading" }));
    const response = await todolistsAPI.deleteTodolist(arg.id).finally(() => {
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.id, status: "idle" }));
    });
    if (response.data.resultCode === RESULT_CODE.SUCCEEDED) {
      return { id: arg.id };
    } else {
      return rejectWithValue(response.data);
    }
  },
);

export const updateTodolistTitle = createAppAsyncThunk<{ id: string; title: string }, { id: string; title: string }>(
  `${slice.name}/updateTodolistTitle`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.id, status: "loading" }));
    const response = await todolistsAPI.updateTodolistTitle(arg.id, arg.title);
    if (response.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.id, status: "succeeded" }));
      return { id: arg.id, title: arg.title };
    } else {
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.id, status: "failed" }));
      return rejectWithValue(response.data);
    }
  },
);

export const todolistsSlice = slice.reducer;
export const todolistsActions = slice.actions;
export const todoListsThunks = { setTodoLists, addTodolist, deleteTodolist, updateTodolistTitle };

//Types
export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
