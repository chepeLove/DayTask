import {Dispatch} from "redux";
import {authAPI, RESULT_CODE} from "../api/api";
import {ErrorType, handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {setIsLoggedIn} from "./auth-reducer";
import axios from "axios";
import {AppThunk} from "../store/store";

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

export const initializedAppTC = ():AppThunk => async (dispatch:Dispatch) => {
    try {
        const result = await authAPI.me()
        if (result.data.resultCode === RESULT_CODE.SUCCEEDED) {
            dispatch(setIsLoggedIn(true))
        }else {
            handleServerAppError(result.data, dispatch)
        }
        dispatch(setAppInitializedAC(true))
    } catch (error) {
        if (axios.isAxiosError<ErrorType>(error)) {
            const errorMessage = error.response?.data ? error.response?.data.messages[0] : error.message
            handleServerNetworkError(dispatch, errorMessage)
        } else {
            handleServerNetworkError(dispatch, (error as Error).message)
        }
    }
}

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