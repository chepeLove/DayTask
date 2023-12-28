import React, { FC } from "react";
import { Button, EditableSpan } from "common/components";
import { RequestStatusType } from "app/appSlice";

type TodolistTitleProps = {
  id: string;
  title: string;
  entityStatus: RequestStatusType;
  deleteTodolist: (id: string) => void;
  updateTodolistTitle: (id: string, title: string) => void;
};
export const TodolistTitle: FC<TodolistTitleProps> = ({
  id,
  title,
  entityStatus,
  updateTodolistTitle,
  deleteTodolist,
}) => {
  const deleteTodolistHandler = (id: string) => () => {
    deleteTodolist(id);
  };

  const updateTodolistTitleHandler = (id: string) => (title: string) => {
    updateTodolistTitle(id, title);
  };
  return (
    <div>
      <Button name={"X"} callBackButton={deleteTodolistHandler(id)} disabled={entityStatus === "loading"} />
      <h3>
        <EditableSpan
          value={title}
          onChangeTitleCallback={updateTodolistTitleHandler(id)}
          disabled={entityStatus === "loading"}
        />
      </h3>
    </div>
  );
};
