import React, {ChangeEvent} from 'react';

type CheckBoxPropsType = {
    checked:boolean
    setCheck:(checked:boolean)=> void
}
export const CheckBox = (props:CheckBoxPropsType) => {
    const onChangeCheckBox = (event:ChangeEvent<HTMLInputElement>)=>{
        props.setCheck(event.currentTarget.checked)
    }
    return (
        <>
            <input type="checkbox" onChange={onChangeCheckBox}/>
        </>
    );
};
