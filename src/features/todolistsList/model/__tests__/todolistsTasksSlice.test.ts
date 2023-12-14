import { TasksReducer, TasksStateType } from "features/todolistsList/model/tasks/tasksSlice";
import { TodolistsReducer, TodolistDomainType } from "features/todolistsList/model/todolists/todolistsSlice";
import { addTodolistAC } from "features/todolistsList/model/todolists/todolistsSlice";

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];

  let newTodolist = { id: "todolistId1", title: "What!", filter: "all", addedDate: "", order: 0 };
  const action = addTodolistAC(newTodolist);

  const endTasksState = TasksReducer(startTasksState, action);
  const endTodolistsState = TodolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});
