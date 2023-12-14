import { instance } from "common/api";
import { LoginParamsType } from "features/auth/api/authApi.types";
import { ResponseType } from "common/types";

export const authAPI = {
  login(params: LoginParamsType) {
    return instance.post<ResponseType<{ userId?: number }>>("auth/login", params);
  },
  logout() {
    return instance.delete<ResponseType>("auth/login");
  },
  me() {
    return instance.get<ResponseType<{ id: number; email: string; login: string }>>("auth/me");
  },
};
