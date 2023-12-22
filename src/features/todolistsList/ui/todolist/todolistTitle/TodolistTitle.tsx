import React, { FC } from "react";
import { Button, EditableSpan } from "common/components";
import { RequestStatusType } from "app/appSlice";

type TodolistTitleProps = {
  id: string;
  title: string;
  entityStatus: RequestStatusType;
  removeTodolist: (id: string) => void;
  changeTitleTodolist: (id: string, title: string) => void;
};
export const TodolistTitle: FC<TodolistTitleProps> = ({
  id,
  title,
  entityStatus,
  changeTitleTodolist,
  removeTodolist,
}) => {
  return (
    <div>
      <Button name={"X"} callBackButton={() => removeTodolist(id)} disabled={entityStatus === "loading"} />
      <h3>
        <EditableSpan
          value={title}
          onChangeTitleCallback={(title) => changeTitleTodolist(id, title)}
          disabled={entityStatus === "loading"}
        />
      </h3>
    </div>
  );
};
