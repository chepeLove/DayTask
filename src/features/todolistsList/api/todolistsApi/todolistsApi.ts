import { instance } from "common/api";
import { ResponseType } from "common/types";
import { TodolistType } from "features/todolistsList/api/todolistsApi/todolistsApi.types";

export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", { title });
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`);
  },
  updateTodolistTitle(id: string, title: string) {
    return instance.put(`todo-lists/${id}`, { title });
  },
};
