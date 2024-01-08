import { useMutation } from "react-query";
import { AuthAPI } from "../apis/AuthAPI";
import { AuthToken, Login, Password } from "../models/Auth";

export const useLogin = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "login",
    mutationFn: async (params: Login) => {
      return await AuthAPI.login(params);
    },
  });

  return { mutate, isLoading, error, data };
};

export const useRefresh = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "refresh",
    mutationFn: async (params: AuthToken) => {
      return await AuthAPI.refresh(params);
    },
  });

  return { mutate, isLoading, error, data };
};

export const usePassword = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "changePassword",
    mutationFn: async (params: Password) => {
      return await AuthAPI.changePassword(params);
    },
  });

  return { mutate, isLoading, error, data };
};