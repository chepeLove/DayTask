import React from 'react';
import {Input} from "../Input";
import {useEditableSpan} from "./hooks/useEditableSpan";

type EditableSpanType = {
    value: string
    onChangeTitleCallback: (newTitle: string) => void
}
export const EditableSpan: React.FC<EditableSpanType> = React.memo(({value, onChangeTitleCallback}) => {

      const {editMode,title,onBlur,onChange,changeEditMode} = useEditableSpan(value,onChangeTitleCallback)

        return (
            editMode
                ? <Input value={title} onBlurCallback={onBlur} onChangeCallback={onChange}/>
                : <span onDoubleClick={changeEditMode}>{title}</span>
        );
    }
)
