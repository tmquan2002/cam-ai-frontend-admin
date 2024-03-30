import { useMutation } from "react-query";
import { AuthAPI } from "../apis/AuthAPI";
import { Login } from "../models/Auth";

export const useLogin = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "login",
    mutationFn: async (params: Login) => {
      return await AuthAPI.login(params);
    },
  });

  return { mutate, isLoading, error, data };
};