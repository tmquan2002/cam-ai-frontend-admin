import { UseQueryResult, useQuery } from "react-query";
import {
  GetBrandsPagingResult,
  GetBrandsParams,
  BrandAPI,
} from "../apis/BrandAPI";

export const useGetAllPlans = (params: GetBrandsParams) => {
  const {
    isError,
    isLoading,
    data,
    error,
    refetch,
  }: UseQueryResult<GetBrandsPagingResult, Error> = useQuery({
    queryKey: ["plans", params?.name],
    queryFn: async () => {
      return await BrandAPI.getAllFilter(params);
    },
  });

  return { isError, isLoading, data, error, refetch };
};