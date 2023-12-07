import { addTaskAC, removeTaskAC, setTasksAC, TasksReducer, TasksStateType, updateTaskAC } from "../tasks-reducer";
import { setTodolistsAC } from "../todolists-reducer";
import { addTodolistAC, removeTodolistAC } from "../todolists-reducer";
import { TaskPriorities, TasksStatuses } from "../../api/api";

let startState: TasksStateType;
beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TasksStatuses.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "2",
        title: "CSS",
        status: TasksStatuses.Completed,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "3",
        title: "CSS",
        status: TasksStatuses.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "CSS",
        status: TasksStatuses.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "2",
        title: "CSS",
        status: TasksStatuses.Completed,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "3",
        title: "CSS",
        status: TasksStatuses.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
  };
});

test("correct task should be added to correct array", () => {
  const newTask = {
    id: "2",
    title: "React Native",
    status: TasksStatuses.New,
    todoListId: "todoListId1",
    description: "",
    startDate: "",
    deadline: "",
    addedDate: "",
    order: 0,
    priority: TaskPriorities.Low,
  };

  const action = addTaskAC("todolistId2", newTask);

  const endState = TasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("React Native");
  expect(endState["todolistId2"][0].status).toBe(TasksStatuses.New);
});
test("should update the task in the specified todolist", () => {
  const todolistId = "todolistId1";
  const taskId = "2";
  const model = {
    title: "Updated Title",
    status: TasksStatuses.Completed,
    description: "Updated Description",
  };

  const action = updateTaskAC(todolistId, taskId, model);
  const endState = TasksReducer(startState, action);

  expect(endState[todolistId]).toEqual([
    {
      id: "1",
      title: "CSS",
      status: TasksStatuses.New,
      todoListId: "todolistId1",
      description: "",
      startDate: "",
      deadline: "",
      addedDate: "",
      order: 0,
      priority: TaskPriorities.Low,
    },
    {
      id: "2",
      title: "Updated Title",
      status: TasksStatuses.Completed,
      todoListId: "todolistId1",
      description: "Updated Description",
      startDate: "",
      deadline: "",
      addedDate: "",
      order: 0,
      priority: TaskPriorities.Low,
    },
    {
      id: "3",
      title: "CSS",
      status: TasksStatuses.New,
      todoListId: "todolistId1",
      description: "",
      startDate: "",
      deadline: "",
      addedDate: "",
      order: 0,
      priority: TaskPriorities.Low,
    },
  ]);
});
test("should remove the task from the specified todolist", () => {
  const todolistId = "todolistId1";
  const taskId = "2";

  const action = removeTaskAC(todolistId, taskId);
  const endState = TasksReducer(startState, action);

  expect(startState[todolistId].length).toBe(3);
  expect(endState[todolistId].length).toBe(2);
});
test("new array should be added when new todolist is added", () => {
  const newTodolist = { id: "todolistTestId", title: "new todolist", filter: "all", addedDate: "", order: 0 };

  const action = addTodolistAC(newTodolist);

  const endState = TasksReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k != "todolistId1" && k != "todolistId2");
  if (!newKey) {
    throw Error("new key should be added");
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});
test("property with todolistId should be deleted", () => {
  const action = removeTodolistAC("todolistId2");

  const endState = TasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});
test("empty arrays should be added when we set todolists", () => {
  const action = setTodolistsAC([
    { id: "1", title: "What!", addedDate: "", order: 0 },
    { id: "2", title: "What!", addedDate: "", order: 0 },
  ]);
  const endState = TasksReducer({}, action);
  const keys = Object.keys(endState);
  expect(keys.length).toBe(2);
  expect(endState["1"]).toStrictEqual([]);
  expect(endState["2"]).toStrictEqual([]);
});
test("tasks should be added for todolist", () => {
  const action = setTasksAC("todolistId1", startState["todolistId1"]);

  const endState = TasksReducer(
    {
      todolistId2: [],
      todolistId1: [],
    },
    action,
  );

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(0);
});
