import React, {ChangeEvent} from 'react';

type CheckBoxPropsType = {
    checked: boolean;
    onChangeCallback: (event: ChangeEvent<HTMLInputElement>) => void;
}
export const CheckBox = (props:CheckBoxPropsType) => {

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>{
        props.onChangeCallback(e)
    }
    return (
        <>
            <input type="checkbox" onChange={onChangeHandler} checked={props.checked}/>
        </>
    );
};
