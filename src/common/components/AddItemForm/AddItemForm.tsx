import React from "react";
import { Input } from "common/components/Input/Input";
import { Button } from "common/components/Button/Button";
import { useAddItemForm } from "common/components/AddItemForm/hooks/useAddItemForm";
import s from "common/components/AddItemForm/AddItemForm.module.css";

type AddItemFormType = {
  addItem: (taskTitle: string) => void;
  disabled?: boolean;
};
export const AddItemForm: React.FC<AddItemFormType> = React.memo(({ addItem, disabled = false }) => {
  const { title, onChangeSetValue, onKeyDownSetValue, error, onClickAddTAsk, isAddTaskPossible } =
    useAddItemForm(addItem);

  return (
    <div>
      <Input
        value={title}
        disabled={disabled}
        onChangeCallback={onChangeSetValue}
        onKeyDownCallback={onKeyDownSetValue}
        error={error}
      />
      <Button name={"+"} callBackButton={onClickAddTAsk} disabled={isAddTaskPossible || disabled} />
      {error && <div className={s.errorMessage}>{error}</div>}
    </div>
  );
});
