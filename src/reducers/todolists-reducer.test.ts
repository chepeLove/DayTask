import {
    addTodolistAC, changeFilterAC, changeTitleTodolistAC,
    removeTodolistAC,
    TodolistsReducer
} from './todolists-reducer';
import {v1} from 'uuid';
import {FilterValuesType, TodolistType} from '../App';
import {TasksReducer, TasksStateType} from "./tasks-reducer";

test('correct todolist should be removed', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    const startState: Array<TodolistType> = [
        {todolistId: todolistId1, todolistTitle: "What to learn", filter: "all"},
        {todolistId: todolistId2, todolistTitle: "What to buy", filter: "all"}
    ]

    const endState = TodolistsReducer(startState, removeTodolistAC(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].todolistId).toBe(todolistId2);
});

test('correct todolist should be added', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let newTodolistTitle = "New Todolist";

    const startState: Array<TodolistType> = [
        {todolistId: todolistId1, todolistTitle: "What to learn", filter: "all"},
        {todolistId: todolistId2, todolistTitle: "What to buy", filter: "all"}
    ]

    const endState = TodolistsReducer(startState, addTodolistAC(newTodolistTitle))

    expect(endState.length).toBe(3);
    expect(endState[2].todolistTitle).toBe(newTodolistTitle);
    expect(endState[2].filter).toBe("all");
    expect(endState[2].todolistId).toBeDefined();
});

test('correct todolist should change its name', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let newTodolistTitle = "New Todolist";

    const startState: Array<TodolistType> = [
        {todolistId: todolistId1, todolistTitle: "What to learn", filter: "all"},
        {todolistId: todolistId2, todolistTitle: "What to buy", filter: "all"}
    ]


    const action = changeTitleTodolistAC(todolistId2, newTodolistTitle);

    const endState = TodolistsReducer(startState, action);

    expect(endState[0].todolistTitle).toBe("What to learn");
    expect(endState[1].todolistTitle).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let newFilter: FilterValuesType = "completed";

    const startState: Array<TodolistType> = [
        {todolistId: todolistId1, todolistTitle: "What to learn", filter: "all"},
        {todolistId: todolistId2, todolistTitle: "What to buy", filter: "all"}
    ]

    const action = changeFilterAC(todolistId2, newFilter);

    const endState = TodolistsReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});


test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodolistType> = []

    const action = addTodolistAC('new todolist')

    const endTasksState = TasksReducer(startTasksState, action)
    const endTodolistsState = TodolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].todolistId

    expect(idFromTasks).toBe(action.payload.newTodolistId)
    expect(idFromTodolists).toBe(action.payload.newTodolistId)
})



