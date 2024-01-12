import { UseQueryResult, useMutation, useQuery } from "react-query";
import {
  GetBrandsPagingResult,
  GetBrandsParams,
  BrandAPI,
  GetBrandsResult,
  AddUpdateBrandParams,
} from "../apis/BrandAPI";

export const useGetAllBrands = (params: GetBrandsParams) => {
  const {
    isError,
    isLoading,
    isFetching,
    data,
    error,
    refetch,
  }: UseQueryResult<GetBrandsPagingResult, Error> = useQuery({
    queryKey: ["brandList", params?.size, params.pageIndex],
    queryFn: async () => {
      return await BrandAPI.getAllFilter(params);
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetBrandById = (id: string) => {
  const {
    isError,
    isLoading,
    data,
    error,
    refetch,
  }: UseQueryResult<GetBrandsResult, Error> = useQuery({
    queryKey: ["brandDetail", id],
    queryFn: async () => {
      return await BrandAPI.getById(id);
    },
  });

  return { isError, isLoading, data, error, refetch };
};

export const useAddBrand = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "addBrand",
    mutationFn: async (params: AddUpdateBrandParams) => {
      return await BrandAPI.add(params);
    },
  });

  return { mutate, isLoading, error, data };
};