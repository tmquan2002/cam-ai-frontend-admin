import { AuthToken, Login, Password } from "../models/Auth";
import http from "../utils/http";

export const AuthAPI = {
  login: async (params: Login) => {
    const res = await http.post<AuthToken>("/api/auth", params);
    return res.data;
  },
  refresh: async (params: AuthToken) => {
    const res = await http.post<string>("/api/auth/refresh", params);
    return res.data;
  },
  changePassword: async (params: Password) => {
    const res = await http.post("/api/auth/password", params);
    return res.data;
  },
};
