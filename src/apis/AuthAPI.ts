import { AuthToken, Login } from "../models/Auth";
import http from "../utils/http";

export const AuthAPI = {
  login: async (params: Login) => {
    const res = await http.post<AuthToken>("/api/auth", params);
    return res.data;
  }
};
