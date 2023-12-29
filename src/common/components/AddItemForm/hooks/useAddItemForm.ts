import { ChangeEvent, KeyboardEvent, useCallback, useState } from "react";
import { BaseResponseType } from "common/types";

export const useAddItemForm = (onAddItem: (taskTitle: string) => Promise<unknown>) => {
  const [title, setTitle] = useState("");

  const [error, setError] = useState<string | null>(null);

  const isAddTaskPossible = !title;
  const addNewItem = useCallback(() => {
    if (title.trim()) {
      onAddItem(title.trim())
        .then(() => {
          setTitle("");
        })
        .catch((err: BaseResponseType) => {
          if (err?.resultCode) {
            setError(err.messages[0]);
          }
        });
    } else {
      setError("Please, enter text");
    }

    setTitle("");
  }, [title]);

  const onChangeValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTitle(e.currentTarget.value);
    },
    [title],
  );

  const onKeyDownValue = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      error && setError(null);
      e.key === "Enter" && addNewItem();
    },
    [setError, addNewItem],
  );

  const onAddTask = useCallback(() => {
    !isAddTaskPossible && addNewItem();
  }, [addNewItem]);

  return {
    title,
    onChangeValue,
    onKeyDownValue,
    error,
    onAddTask,
    isAddTaskPossible,
  };
};
