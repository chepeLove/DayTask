import {AppReducer, InitialStateType, setAppErrorAC, setAppStatusAC} from "../app-reducer";

let startState: InitialStateType

beforeEach(() => {
    startState = {
        error:null,
        status:'idle'
    }
})

test('correct error should be set',()=>{
    const endState = AppReducer(startState,setAppErrorAC('some error'))
    expect(endState.error).toBe('some error')
})
test('correct error should be set',()=>{
    const endState = AppReducer(startState,setAppStatusAC('loading'))
    expect(endState.status).toBe('loading')
})