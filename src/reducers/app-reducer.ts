
const initialState:InitialStateType = {
    status: 'idle',
    error:null
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':{
            return {...state, status: action.payload.status}
        }
        case 'APP/SET-ERROR':{
            return {...state,error:action.payload.error}
        }
        default:
            return state
    }
}

//Actions
export const setAppStatusAC = (status:RequestStatusType) => ({type:'APP/SET-STATUS',payload:{status}}as const)
export const setAppErrorAC = (error:string | null) => ({type:'APP/SET-ERROR',payload:{error}}as const)



//Types

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = {
    status:RequestStatusType,
    error: string | null
}

type ActionsType = SetAppStatus | SetAppError
type SetAppStatus = ReturnType<typeof setAppStatusAC>
type SetAppError = ReturnType<typeof setAppErrorAC>