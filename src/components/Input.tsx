import React, {KeyboardEvent, RefObject} from 'react';

type InputPropsType = {
    addNewTask:(titleInput:string)=> void
    onChangeRef:RefObject<HTMLInputElement>
    addTask:()=>void
}

export const Input = (props:InputPropsType) => {

    const onKeyPressHandler = (event:KeyboardEvent<HTMLInputElement>) => {
        if(event.key === 'Enter'){
            props.addTask()
        }
    }

    return (
         <input ref ={props.onChangeRef}
               onKeyDown={onKeyPressHandler}
        />
    );
};

export default Input;