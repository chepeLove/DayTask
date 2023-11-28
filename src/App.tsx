import React, {useCallback, useEffect} from 'react';
import './App.css';
import {TodolistList} from "./components/todolistsList/TodolistList";
import {Login} from "./components/login/Login";
import {Routes,Route, Navigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "./store/hooks/hooks";
import {Preloader} from "./components/preloader/Preloader";
import {initializedAppTC} from "./reducers/app-reducer";
import {Button} from "./components/button/Button";
import {logoutTC} from "./reducers/auth-reducer";


function App() {

    const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(initializedAppTC())
    }, []);

    const logoutHandler = useCallback(()=>{
        dispatch(logoutTC())
    },[])

    if(!isInitialized){
        return <Preloader/>
    }


    return <>
        <Button name={'log out'} callBackButton={logoutHandler}/>
        <Routes>
            <Route path={'/login'} element = {<Login/>}/>
            <Route path={'/'} element = {<TodolistList/>}/>
            <Route path={'/404'} element={<h1>404: PAGE NOT FOUND</h1>}/>
            <Route path={'*'} element={<Navigate to = {'/404'} />}/>
        </Routes>
      </>

}

export default App;
