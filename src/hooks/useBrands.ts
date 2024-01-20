import { UseQueryResult, useMutation, useQuery } from "react-query";
import {
  GetBrandsPagingResult, GetBrandsParams, BrandAPI, GetBrandsResult, AddBrandParams, UpdateBrandParams,
} from "../apis/BrandAPI";

export const useGetAllBrands = (params: GetBrandsParams) => {
  const { isError, isLoading, isFetching, data, error, refetch,
  }: UseQueryResult<GetBrandsPagingResult, Error> = useQuery({
    queryKey: ["brandList", params.size, params.pageIndex],
    queryFn: async () => {
      return await BrandAPI.getAllFilter(params);
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetAllBrandsSelect = (params: GetBrandsParams) => {
  const { isError, isLoading, isFetching, data, error, refetch,
  }: UseQueryResult<SelectType[], Error> = useQuery({
    queryKey: ["brandListSelect", params.name],
    queryFn: async () => {
      const res = await BrandAPI.getAllFilter(params);
      return res.values.map((items) => ({
        value: items.id,
        label: items.name
      }))
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetBrandById = (id: string) => {
  const { isError, isLoading, data, error, refetch,
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
    mutationFn: async (params: AddBrandParams) => {
      return await BrandAPI.add(params);
    },
  });

  return { mutate, isLoading, error, data };
};

export const useUpdateBrand = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "updateBrand",
    mutationFn: async (params: UpdateBrandParams) => {
      return await BrandAPI.update(params);
    },
  });

  return { mutate, isLoading, error, data };
};

export const useDeleteBrand = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "deleteBrand",
    mutationFn: async (id: string) => {
      return await BrandAPI.delete(id);
    },
  });

  return { mutate, isLoading, error, data };
};

export const useReactivateBrand = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "reactivateBrand",
    mutationFn: async (id: string) => {
      return await BrandAPI.reactivate(id);
    },
  });

  return { mutate, isLoading, error, data };
};