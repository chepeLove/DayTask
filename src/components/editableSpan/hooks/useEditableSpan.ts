import {ChangeEvent, useState} from "react";

export const useEditableSpan = (value: string, onChangeTitleCallback: (newTitle: string) => void) => {

    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState(value)

    const changeEditMode = () => {
        setEditMode(!editMode)
        setTitle(title)
    }
    const onBlur = () => {
        setEditMode(!editMode)
        onChangeTitleCallback(title)
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return{
        changeEditMode,
        onBlur,
        onChange,
        editMode,
        title
    }
}