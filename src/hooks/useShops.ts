import { UseQueryResult, useQuery } from "react-query";
import { GetShopsPagingResult, GetShopsParams, ShopAPI } from "../apis/ShopAPI";
import { Shop } from "../models/Shop";

export const useGetAllShops = (params: GetShopsParams) => {
  const {
    isError,
    isLoading,
    isFetching,
    data,
    error,
    refetch,
  }: UseQueryResult<GetShopsPagingResult, Error> = useQuery({
    queryKey: ["shopList", params.size, params.pageIndex],
    queryFn: async () => {
      return await ShopAPI.getAllFilter(params);
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetAllShopsSelect = (params: GetShopsParams) => {
  const { isError, isLoading, isFetching, data, error, refetch,
  }: UseQueryResult<SelectType[], Error> = useQuery({
    queryKey: ["shopListSelect"],
    queryFn: async () => {
      const res = await ShopAPI.getAllFilter(params);
      return res.values.map((items) => ({
        value: items.id,
        label: items.name
      }))
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetShopById = (id: string | undefined) => {
  const {
    isError,
    isLoading,
    data,
    error,
    refetch,
  }: UseQueryResult<Shop, Error> = useQuery({
    queryKey: ["shopDetail", id],
    queryFn: async () => {
      if (id) {
        return await ShopAPI.getById(id);
      } else {
        return {}
      }
    },
    enabled: !!id,
  });

  return { isError, isLoading, data, error, refetch };
};