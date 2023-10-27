import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from 'react';
import {Input} from "./Input";
import {Button} from "./Button";

type AddItemFormType = {
    addItem:(title:string)=>void
}
export const AddItemForm:React.FC<AddItemFormType> = React.memo(({addItem}) => {

    const [title, setTitle] = useState('')

    const [error, setError] = useState<string | null>(null)

    const isAddTaskPossible = !title
    const addNewItem = useCallback(() => {

        if (title.trim()) {
            addItem(title.trim())
        } else {
            setError('Please, enter text')
        }

        setTitle('')

    },[title])

    const onChangeSetValueHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    },[title])

        const onKeyDownSetValueHandler = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        error && setError(null)
        e.key === 'Enter' && addNewItem()
    },[setError,addNewItem])

        const onClickAddTAskHandler = useCallback(() => {
            !isAddTaskPossible &&
            addNewItem()
        },[addNewItem])

        return (
        <div>
            <Input
                value={title}
                onChangeCallback={onChangeSetValueHandler}
                onKeyDownCallback={onKeyDownSetValueHandler}
                error={error}
            />
            <Button name={'+'} callBackButton={onClickAddTAskHandler} disabled={isAddTaskPossible}/>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}
)
