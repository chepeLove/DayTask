import { instance } from "common/api";
import { LoginParamsType } from "features/auth/api/authApi.types";
import { BaseResponseType } from "common/types";

export const authAPI = {
  login(params: LoginParamsType) {
    return instance.post<BaseResponseType<{ userId?: number }>>("auth/login", params);
  },
  logout() {
    return instance.delete<BaseResponseType>("auth/login");
  },
  me() {
    return instance.get<BaseResponseType<{ id: number; email: string; login: string }>>("auth/me");
  },
};
