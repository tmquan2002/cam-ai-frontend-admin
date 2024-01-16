import { UseQueryResult, useQuery } from "react-query";
import { AccountAPI, GetAccountsPagingResult, GetAccountsParams } from "../apis/AccountAPI";

export const useGetAllAccounts = (params: GetAccountsParams) => {
  const {
    isError,
    isLoading,
    isFetching,
    data,
    error,
    refetch,
  }: UseQueryResult<GetAccountsPagingResult, Error> = useQuery({
    queryKey: ["accountList", params.size, params.pageIndex],
    queryFn: async () => {
      return await AccountAPI.getAllFilter(params);
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};