import React, { ChangeEvent } from "react";
import { CheckBox } from "common/components/Checkbox/CheckBox";
import { Button } from "common/components/Button/Button";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { useTask } from "features/todolistsList/ui/todolist/tasks/task/hooks/useTask";
import { TaskDomainType } from "features/todolistsList/model/tasks/tasksSlice";
import s from "features/todolistsList/ui/todolist/tasks/task/Task.module.css";
import { TasksStatuses } from "common/enums";

type TaskPropsType = {
  todolistId: string;
} & TaskDomainType;

export const Task: React.FC<TaskPropsType> = React.memo(({ todolistId, id, title, status, entityStatus }) => {
  const { changeTaskStatus, removeTask, changeTitleTask } = useTask(todolistId);
  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let newIsDoneValue = e.currentTarget.checked;
    changeTaskStatus(newIsDoneValue ? TasksStatuses.Completed : TasksStatuses.New, id);
  };

  const changeTitleTaskHandler = (title: string) => {
    changeTitleTask(title, id);
  };

  const removeTaskHandler = () => {
    removeTask(id);
  };

  return (
    <li key={id} className={status === TasksStatuses.Completed ? s.taskDone : s.task}>
      <CheckBox
        checked={status === TasksStatuses.Completed}
        onChangeCallback={changeTaskStatusHandler}
        disabled={entityStatus === "loading"}
      />
      <EditableSpan
        value={title}
        onChangeTitleCallback={changeTitleTaskHandler}
        disabled={entityStatus === "loading"}
      />
      <Button name={"X"} callBackButton={removeTaskHandler} disabled={entityStatus === "loading"} />
    </li>
  );
});
