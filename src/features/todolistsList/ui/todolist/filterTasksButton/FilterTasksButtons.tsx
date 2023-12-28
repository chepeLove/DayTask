import React, { FC } from "react";
import { Button } from "common/components";
import s from "features/todolistsList/ui/todolist/Todolist.module.css";
import { FilterValuesType } from "features/todolistsList/model/todolists/todoListsSlice";

type FilterTasksButtonsProps = {
  todolistId: string;
  filter: FilterValuesType;
  changeFilterTodolist: (id: string, value: FilterValuesType) => void;
};
export const FilterTasksButtons: FC<FilterTasksButtonsProps> = ({ filter, changeFilterTodolist, todolistId }) => {
  const changeFilterTasksHandler = (value: FilterValuesType) => () => {
    changeFilterTodolist(todolistId, value);
  };
  return (
    <>
      <Button
        className={filter === "all" ? s.buttonTaskFilterActive : s.buttonTaskFilter}
        name={"All"}
        callBackButton={changeFilterTasksHandler("all")}
      />
      <Button
        className={filter === "active" ? s.buttonTaskFilterActive : s.buttonTaskFilter}
        name={"Active"}
        callBackButton={changeFilterTasksHandler("active")}
      />
      <Button
        className={filter === "completed" ? s.buttonTaskFilterActive : s.buttonTaskFilter}
        name={"Completed"}
        callBackButton={changeFilterTasksHandler("completed")}
      />
    </>
  );
};
