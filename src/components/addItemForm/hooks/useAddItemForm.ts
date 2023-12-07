import { ChangeEvent, KeyboardEvent, useCallback, useState } from "react";

export const useAddItemForm = (onAddItem: (taskTitle: string) => void) => {
  const [title, setTitle] = useState("");

  const [error, setError] = useState<string | null>(null);

  const isAddTaskPossible = !title;
  const addNewItem = useCallback(() => {
    if (title.trim()) {
      onAddItem(title.trim());
    } else {
      setError("Please, enter text");
    }

    setTitle("");
  }, [title]);

  const onChangeSetValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTitle(e.currentTarget.value);
    },
    [title],
  );

  const onKeyDownSetValue = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      error && setError(null);
      e.key === "Enter" && addNewItem();
    },
    [setError, addNewItem],
  );

  const onClickAddTAsk = useCallback(() => {
    !isAddTaskPossible && addNewItem();
  }, [addNewItem]);

  return {
    title,
    onChangeSetValue,
    onKeyDownSetValue,
    error,
    onClickAddTAsk,
    isAddTaskPossible,
  };
};
