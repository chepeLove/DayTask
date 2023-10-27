import React from 'react';
import {Input} from "../Input";
import {Button} from "../Button";
import {useAddItemForm} from "./hooks/useAddItemForm";

type AddItemFormType = {
    addItem: (taskTitle: string) => void
}
export const AddItemForm: React.FC<AddItemFormType> = React.memo(({addItem}) => {

        const {
            title,
            onChangeSetValue,
            onKeyDownSetValue,
            error,
            onClickAddTAsk,
            isAddTaskPossible
        } = useAddItemForm(addItem)

        return (
            <div>
                <Input
                    value={title}
                    onChangeCallback={onChangeSetValue}
                    onKeyDownCallback={onKeyDownSetValue}
                    error={error}
                />
                <Button name={'+'} callBackButton={onClickAddTAsk} disabled={isAddTaskPossible}/>
                {error && <div className="error-message">{error}</div>}
            </div>
        );
    }
)
