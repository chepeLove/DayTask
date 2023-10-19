import {
    addTodolistAC, changeFilterAC, changeTitleTodolistAC, FilterValuesType,
    removeTodolistAC,
    TodolistsReducer, TodolistType
} from './todolists-reducer';
import {v1} from 'uuid';

let todolistId1:string
let todolistId2:string

let startState: Array<TodolistType>

beforeEach(()=>{
    todolistId1 = v1()
    todolistId2=v1()

    startState = [
        {todolistId: todolistId1, todolistTitle: "What to learn", filter: "all"},
        {todolistId: todolistId2, todolistTitle: "What to buy", filter: "all"}
    ]
})

test('correct todolist should be removed', () => {

    const endState = TodolistsReducer(startState, removeTodolistAC(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].todolistId).toBe(todolistId2);
});

test('correct todolist should be added', () => {
    let newTodolistTitle = "New Todolist";

    const endState = TodolistsReducer(startState, addTodolistAC(newTodolistTitle))

    expect(endState.length).toBe(3);
    expect(endState[2].todolistTitle).toBe(newTodolistTitle);
    expect(endState[2].filter).toBe("all");
    expect(endState[2].todolistId).toBeDefined();
});

test('correct todolist should change its name', () => {
    let newTodolistTitle = "New Todolist";

    const action = changeTitleTodolistAC(todolistId2, newTodolistTitle);

    const endState = TodolistsReducer(startState, action);

    expect(endState[0].todolistTitle).toBe("What to learn");
    expect(endState[1].todolistTitle).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const action = changeFilterAC(todolistId2, newFilter);

    const endState = TodolistsReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});




