import { useAppSelector } from "common/hooks/useAppSelector";
import { TaskDomainType, tasksThunks } from "features/todolistsList/model/tasks/tasksSlice";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { useCallback } from "react";
import { TasksStatuses } from "common/enums";
import { FilterValuesType } from "features/todolistsList/model/todolists/todolistsSlice";

export const useTask = (todolistId: string) => {
  const tasks = useAppSelector<TaskDomainType[]>((state) => state.tasks[todolistId]);
  const dispatch = useAppDispatch();

  const addTask = useCallback(
    (taskTitle: string) => {
      dispatch(tasksThunks.addTask({ todolistId: todolistId, title: taskTitle }));
    },
    [dispatch],
  );

  const removeTask = useCallback(
    (id: string) => {
      dispatch(tasksThunks.deleteTask({ todolistId, taskId: id }));
    },
    [dispatch],
  );

  const changeTaskStatus = useCallback(
    (status: TasksStatuses, id: string) => {
      dispatch(tasksThunks.updateTask({ todolistId, taskId: id, domainModel: { status } }));
    },
    [dispatch],
  );

  const changeTitleTask = useCallback(
    (title: string, id: string) => {
      dispatch(tasksThunks.updateTask({ todolistId, taskId: id, domainModel: { title } }));
    },
    [dispatch],
  );

  const getTaskForRender = (tasks: TaskDomainType[], filter: FilterValuesType) => {
    switch (filter) {
      case "active":
        return tasks.filter((task) => task.status === TasksStatuses.New);
      case "completed":
        return tasks.filter((task) => task.status === TasksStatuses.Completed);
      default:
        return tasks;
    }
  };

  return {
    tasks,
    removeTask,
    changeTaskStatus,
    changeTitleTask,
    addTask,
    getTaskForRender,
  };
};
