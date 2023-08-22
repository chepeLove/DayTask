import React, {ChangeEvent} from 'react';

type InputPropsType = {
    titleInput:string
    setTitleInput:(titleInput:string)=>void
}

export const Input = (props:InputPropsType) => {

    const onChangeHandler = (event:ChangeEvent<HTMLInputElement>)=>{
        props.setTitleInput(event.currentTarget.value)
    }

    return (
        <input onChange={onChangeHandler} value={props.titleInput}/>
    );
};

export default Input;