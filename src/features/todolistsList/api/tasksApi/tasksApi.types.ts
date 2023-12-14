import { TaskPriorities, TasksStatuses } from "common/enums";

export type TaskType = {
  description: string;
  title: string;
  status: TasksStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
export type TaskResponseType = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};
export type UpdateTaskType = {
  title: string;
  description: string;
  status: TasksStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};
