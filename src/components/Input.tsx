import React, {ChangeEvent, KeyboardEvent} from 'react';

type InputPropsType = {
    title:string
    addTask:()=>void
    setTitle:(title:string)=>void
    setError:(error: string | null)=>void
    error:string | null
}

export const Input = (props:InputPropsType) => {

    const onChangeHandler = (event:ChangeEvent<HTMLInputElement>)=>{
        props.setTitle(event.currentTarget.value)
    }

    const onKeyPressHandler = (event:KeyboardEvent<HTMLInputElement>) => {
        props.setError(null)
        if(event.key === 'Enter'){
            props.addTask()
            props.setTitle('')
        }
    }

    return (
         <input
             className={props.error ? 'error':''}
             value={props.title}
               onKeyDown={onKeyPressHandler}
                onChange={onChangeHandler}
        />
    );
};
