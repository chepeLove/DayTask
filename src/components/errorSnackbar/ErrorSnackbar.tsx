import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../store/hooks/hooks";
import {setAppErrorAC} from "../../reducers/app-reducer";
import s from './ErrorSnackbar.module.css'

export const ErrorSnackbar = () => {

    const error = useAppSelector<string | null>(state => state.app.error)
    const dispatch = useAppDispatch()

    useEffect(() => {
        setTimeout(()=>{
            dispatch(setAppErrorAC(null))
        },5000)
    }, [error]);


    return (
        <div className={s.snackbarContainer}>
            <span>{error}</span>
        </div>
    );
};
