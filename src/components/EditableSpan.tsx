import React, {ChangeEvent, useState} from 'react';
import {Input} from "./Input";

type EditableSpanType = {
    value:string
    onChangeTitleCallback:(newTitle:string) => void
}
export const EditableSpan:React.FC<EditableSpanType> = ({value,onChangeTitleCallback}) => {

    const [editMode,setEditMode]= useState(false)
    const [title,setTitle] = useState(value)

    const changeEditMode = () => {
        setEditMode(!editMode)
        setTitle(value)
    }
    const onBlurHandler = () => {
        setEditMode(!editMode)
        onChangeTitleCallback(title)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return (
        editMode
            ? <Input value={title} onBlurCallback={onBlurHandler} onChangeCallback={onChangeHandler}/>
            :<span onDoubleClick={changeEditMode}>{value}</span>
    );
};
