import { instance } from "common/api";
import { TaskResponseType, TaskType, UpdateTaskType } from "features/todolistsList/api/tasksApi/tasksApi.types";
import { BaseResponseType } from "common/types";

export const taskApi = {
  getTasks(todolistId: string) {
    return instance.get<TaskResponseType>(`todo-lists/${todolistId}/tasks`);
  },
  createTask(arg: { todolistId: string; title: string }) {
    return instance.post<BaseResponseType<{ item: TaskType }>>(`todo-lists/${arg.todolistId}/tasks`, {
      title: arg.title,
    });
  },
  deleteTask(arg: { todolistId: string; taskId: string }) {
    return instance.delete<BaseResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`);
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskType) {
    return instance.put<BaseResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
};
