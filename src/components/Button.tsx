import React from 'react';

type ButtonPropsType = {
    name:string
    callBackButton:()=>void
}


export const Button = (props:ButtonPropsType) => {
    const onClickButtonHandler = ()=>{
        props.callBackButton()
    }

    return (
            <button onClick={onClickButtonHandler}>{props.name}</button>
    );
};

