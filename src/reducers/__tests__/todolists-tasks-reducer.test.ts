import { TasksReducer, TasksStateType } from "../tasks-reducer";
import { TodolistsReducer, TodolistDomainType } from "../todolists-reducer";
import { addTodolistAC } from "../todolists-reducer";

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
