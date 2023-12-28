import React, { FC } from "react";
import { Task } from "features/todolistsList/ui/todolist/tasks/task/Task";
import { FilterValuesType } from "features/todolistsList/model/todolists/todoListsSlice";
import { useAppSelector } from "common/hooks/useAppSelector";
import { tasksSelectors } from "features/todolistsList/model/tasks/tasksSlice";

type TasksProps = {
  todolistId: string;
  filter: FilterValuesType;
};

export const Tasks: FC<TasksProps> = ({ todolistId, filter }) => {
  const tasks = useAppSelector(tasksSelectors.selectTask);
  const tasksForTodolist = useAppSelector((state) =>
    tasksSelectors.filteredTasksByTodolistId({ tasks: state.tasks }, { todolistId, filter }),
  );

  return tasks[todolistId].length ? (
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
