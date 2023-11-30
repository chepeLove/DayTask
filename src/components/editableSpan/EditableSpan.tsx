import React from 'react';
import {Input} from "../input/Input";
import {useEditableSpan} from "./hooks/useEditableSpan";

type EditableSpanType = {
    value: string
    onChangeTitleCallback: (newTitle: string) => void
    disabled?: boolean
}
export const EditableSpan: React.FC<EditableSpanType> = React.memo(({value, onChangeTitleCallback,disabled}) => {

      const {editMode,title,onBlur,onChange,changeEditMode} = useEditableSpan(value,onChangeTitleCallback)

        return (
            editMode && !disabled
                ? <Input value={title} onBlurCallback={onBlur} onChangeCallback={onChange}/>
                : <span onDoubleClick={changeEditMode}>{value}</span>
        );
    }
)
