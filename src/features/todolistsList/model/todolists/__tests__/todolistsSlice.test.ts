import {
  addTodolistAC,
  changeFilterAC,
  changeTitleTodolistAC,
  FilterValuesType,
  removeTodolistAC,
  TodolistsReducer,
  TodolistDomainType,
  setTodolistsAC,
  changeTodolistEntityStatusAC,
} from "features/todolistsList/model/todolists/todolistsSlice";
import { v1 } from "uuid";
import { RequestStatusType } from "app/appSlice";

let todolistId1: string;
let todolistId2: string;

let startState: Array<TodolistDomainType>;

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();

  startState = [
    { id: todolistId1, title: "What to learn", filter: "all", addedDate: "", order: 0, entityStatus: "idle" },
    { id: todolistId2, title: "What to learn", filter: "all", addedDate: "", order: 0, entityStatus: "idle" },
  ];
});

test("correct todolist should be removed", () => {
  const endState = TodolistsReducer(startState, removeTodolistAC(todolistId1));

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});
test("correct todolist should be added", () => {
  let newTodolist = { id: todolistId1, title: "What!", filter: "all", addedDate: "", order: 0, entityStatus: "idle" };

  const endState = TodolistsReducer(startState, addTodolistAC(newTodolist));

  expect(endState.length).toBe(3);
  expect(endState[2].title).toBe("What!");
  expect(endState[2].filter).toBe("all");
  expect(endState[2].id).toBeDefined();
});
test("correct todolist should change its name", () => {
  let newTodolistTitle = "New Todolist";

  const action = changeTitleTodolistAC(todolistId2, newTodolistTitle);

  const endState = TodolistsReducer(startState, action);

  expect(startState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodolistTitle);
});
test("correct filter of todolist should be changed", () => {
  let newFilter: FilterValuesType = "completed";

  const action = changeFilterAC(todolistId2, newFilter);

  const endState = TodolistsReducer(startState, action);

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe(newFilter);
});
test("todolists should be set to the state", () => {
  const action = setTodolistsAC(startState);
  const endState = TodolistsReducer([], action);

  expect(endState.length).toBe(2);
});

test("correct entityStatus of todolist should be changed", () => {
  let newEntityStatus: RequestStatusType = "loading";

  const action = changeTodolistEntityStatusAC(todolistId2, newEntityStatus);

  const endState = TodolistsReducer(startState, action);

  expect(startState[1].entityStatus).toBe("idle");
  expect(endState[1].entityStatus).toBe("loading");
});
