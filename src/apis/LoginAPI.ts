import http from "../utils/http";

export type LoginParams = {
    username: string;
    password: string;
};

export type GetLoginResult = {
    accessToken: number;
    refreshToken: string;
  };

export const LoginAPI = {
    login: async (params: LoginParams) => {
        const res = await http.post<GetLoginResult>("/api/Auth", params);
        return res.data;
    },
}