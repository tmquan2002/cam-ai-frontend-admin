import { UseQueryResult, useMutation, useQuery } from "react-query";
import { AccountAPI, AddAccountParams, GetAccountsParams, UpdateAccountParams } from "../apis/AccountAPI";
import { Account } from "../models/Account";
import { CommonResponse } from "../models/CommonResponse";

export const useGetAllAccounts = (params: GetAccountsParams) => {
  const { isError, isLoading, isFetching, data, error, refetch,
  }: UseQueryResult<CommonResponse<Account>, Error> = useQuery({
    queryKey: ["accountList", params.size, params.pageIndex],
    queryFn: async () => {
      return await AccountAPI.getAllFilter(params);
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetAllAccountsSelect = (params: GetAccountsParams) => {
  const { isError, isLoading, isFetching, data, error, refetch,
  }: UseQueryResult<SelectType[], Error> = useQuery({
    queryKey: ["accountListSelect"],
    queryFn: async () => {
      const res = await AccountAPI.getAllFilter(params);
      return res.values.map((items) => ({
        value: items.id,
        label: items.name
      }))
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetAccountById = (id: string | undefined) => {
  const { isError, isLoading, data, error, refetch,
  }: UseQueryResult<Account, Error> = useQuery({
    queryKey: ["account", id],
    queryFn: async () => {
      if (id) {
        return await AccountAPI.getById(id);
      } else {
        return {}
      }
    },
    enabled: !!id,
  });

  return { isError, isLoading, data, error, refetch };
};

export const useAddAccount = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "addAccount",
    mutationFn: async (params: AddAccountParams) => {
      return await AccountAPI.add(params);
    },
  });

  return { mutate, isLoading, error, data };
};

export const useUpdateAccount = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "updateAccount",
    mutationFn: async (params: UpdateAccountParams) => {
      return await AccountAPI.update(params);
    },
  });

  return { mutate, isLoading, error, data };
};

export const useDeleteAccount = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "deleteAccount",
    mutationFn: async (id: string) => {
      return await AccountAPI.delete(id);
    },
  });

  return { mutate, isLoading, error, data };
};