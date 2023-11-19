import {setAppErrorAC, setAppStatusAC} from "../reducers/app-reducer";
import {ResponseType} from "../api/api";
import {Dispatch} from "redux";

export const handleServerAppError = <D>(data:ResponseType<D>,dispatch:Dispatch)=>{
    if(data.messages.length){
        dispatch(setAppErrorAC(data.messages[0]))
    }else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error:any,dispatch:Dispatch) =>{
    dispatch(setAppErrorAC(error.message ? error.message : 'Some error occured'))
    dispatch(setAppStatusAC('failed'))
}