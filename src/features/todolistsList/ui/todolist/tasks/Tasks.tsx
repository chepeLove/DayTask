import React, { FC } from "react";
import { useTask } from "features/todolistsList/ui/todolist/tasks/task/hooks/useTask";
import { TaskDomainType } from "features/todolistsList/model/tasks/tasksSlice";
import { Task } from "features/todolistsList/ui/todolist/tasks/task/Task";
import { FilterValuesType } from "features/todolistsList/model/todolists/todolistsSlice";

type TasksProps = {
  todolistId: string;
  filter: FilterValuesType;
};

export const Tasks: FC<TasksProps> = ({ todolistId, filter }) => {
  const { tasks, getTaskForRender } = useTask(todolistId);

  const tasksForTodolist: TaskDomainType[] = getTaskForRender(tasks, filter);

  return tasks.length ? (
    <ul>
      {tasksForTodolist?.map((task) => {
        return <Task key={task.id} todolistId={todolistId} {...task} />;
      })}
    </ul>
  ) : (
    <ul>
      <li>
        <span>Your task list is empty</span>
      </li>
    </ul>
  );
};
