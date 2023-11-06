import {TasksReducer, TasksStateType} from "./tasks-reducer";
import {TodolistsReducer, TodolistDomainType} from "./todolists-reducer";
import {addTodolistAC} from "./todolists-reducer";
//
// test('ids should be equals', () => {
//     const startTasksState: TasksStateType = {}
//     const startTodolistsState: Array<TodolistDomainType> = []
//
//     const action = addTodolistAC('new todolist')
//
//     const endTasksState = TasksReducer(startTasksState, action)
//     const endTodolistsState = TodolistsReducer(startTodolistsState, action)
//
//     const keys = Object.keys(endTasksState)
//     const idFromTasks = keys[0]
//     const idFromTodolists = endTodolistsState[0].todolistId
//
//     expect(idFromTasks).toBe(action.payload.newTodolistId)
//     expect(idFromTodolists).toBe(action.payload.newTodolistId)
// })
