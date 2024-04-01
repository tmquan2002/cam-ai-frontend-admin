import axios from "axios";
import { AuthToken, Login, Password } from "../models/Auth";
import http from "../utils/http";

export const AuthAPI = {
  login: async (params: Login) => {
    const res = await http.post<AuthToken>("/api/auth", params);
    return res.data;
  },
  refresh: async (params: AuthToken) => {
    try{
      const res = await axios.post<string>(`${process.env.REACT_APP_VITE_SERVER_LINK}api/auth/refresh`, params);
      return res?.data;
    }catch(err){
      return null;
    }
  },
  changePassword: async (params: Password) => {
    const res = await http.post("/api/auth/password", params);
    return res.data;
  },
};
