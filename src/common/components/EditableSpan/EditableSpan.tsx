import React, { ChangeEvent, useState } from "react";
import { Input } from "common/components/Input/Input";

type EditableSpanType = {
  value: string;
  onChangeTitleCallback: (newTitle: string) => void;
  disabled?: boolean;
};
export const EditableSpan: React.FC<EditableSpanType> = React.memo(({ value, onChangeTitleCallback, disabled }) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(value);

  const changeEditMode = () => {
    setEditMode(!editMode);
    setTitle(title);
  };
  const onBlur = () => {
    setEditMode(!editMode);
    onChangeTitleCallback(title);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  return editMode && !disabled ? (
    <Input value={title} onBlurCallback={onBlur} onChangeCallback={onChange} />
  ) : (
    <span onDoubleClick={changeEditMode}>{value}</span>
  );
});
