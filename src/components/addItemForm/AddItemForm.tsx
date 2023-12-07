import React from "react";
import { Input } from "../input/Input";
import { Button } from "../button/Button";
import { useAddItemForm } from "./hooks/useAddItemForm";
import s from "./AddItemForm.module.css";

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
