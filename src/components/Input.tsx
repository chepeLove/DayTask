import React, {ChangeEvent, KeyboardEvent} from 'react';

type InputPropsType = {
    titleInput:string
    setTitleInput:(titleInput:string)=>void
    addNewTask:(titleInput:string)=> void
}

export const Input = (props:InputPropsType) => {

    const onChangeHandler = (event:ChangeEvent<HTMLInputElement>)=>{
        props.setTitleInput(event.currentTarget.value)
    }

    const onKeyPressHandler = (event:KeyboardEvent<HTMLInputElement>) => {
        if(event.key === 'Enter'){
            props.addNewTask(event.currentTarget.value)
            props.setTitleInput('')
        }
    }

    return (
        <input onChange={onChangeHandler}
               value={props.titleInput}
               onKeyDown={onKeyPressHandler}
        />
    );
};

export default Input;