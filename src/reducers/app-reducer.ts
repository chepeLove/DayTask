
const initialState:InitialStateType = {
    status: 'idle',
    error:null,
    isInitialized:false
}

export const AppReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':{
            return {...state, status: action.payload.status}
        }
        case 'APP/SET-ERROR':{
            return {...state,error:action.payload.error}
        }
        case 'APP/SET-IS-INITIALIZED':{
            return {...state,isInitialized:action.payload.isInitialized}
        }
        default:
            return state
    }
}

//Actions
export const setAppStatusAC = (status:RequestStatusType) => ({type:'APP/SET-STATUS',payload:{status}}as const)
export const setAppErrorAC = (error:string | null) => ({type:'APP/SET-ERROR',payload:{error}}as const)
export const setAppInitializedAC = (isInitialized:boolean) => ({type:'APP/SET-IS-INITIALIZED',payload:{isInitialized}}as const)

//Thunks



//Types

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = {
    status:RequestStatusType
    error: string | null
    isInitialized:boolean
}

type ActionsType = SetAppStatusACType | SetAppErrorACType | SetAppInitializedACType
type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
type SetAppErrorACType = ReturnType<typeof setAppErrorAC>
type SetAppInitializedACType = ReturnType<typeof setAppInitializedAC>