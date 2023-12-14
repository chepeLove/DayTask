import React, { ChangeEvent, FC } from "react";

type CheckBoxPropsType = {
  checked: boolean;
  onChangeCallback: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};
export const CheckBox: FC<CheckBoxPropsType> = ({ onChangeCallback, checked, disabled }) => {
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeCallback(e);
  };
  return (
    <>
      <input type="checkbox" onChange={onChangeHandler} checked={checked} disabled={disabled} />
    </>
  );
};
