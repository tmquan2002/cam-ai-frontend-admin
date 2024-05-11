import { UseQueryResult, useQuery } from "react-query";
import { GetShopsParams, ShopAPI } from "../apis/ShopAPI";
import { CommonResponse } from "../models/CommonResponse";
import { Shop } from "../models/Shop";

export const useGetAllShops = (params: GetShopsParams) => {
  const { isError, isLoading, isFetching, data, error, refetch,
  }: UseQueryResult<CommonResponse<Shop>, Error> = useQuery({
    queryKey: ["shopList", params],
    queryFn: async () => {
      return await ShopAPI.getAllFilter(params);
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetAllShopsInstalling = (params: { q: boolean }) => {
  const { isError, isLoading, isFetching, data, error, refetch,
  }: UseQueryResult<CommonResponse<Shop>, Error> = useQuery({
    queryKey: ["shopListInstalling"],
    queryFn: async () => {
      return await ShopAPI.getAllInstalling(params);
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetAllShopsInstallingSelect = (params: { q: boolean }) => {
  const { isError, isLoading, isFetching, data, error, refetch,
  }: UseQueryResult<SelectType[], Error> = useQuery({
    queryKey: ["shopListInstallSelect"],
    queryFn: async () => {
      const res = await ShopAPI.getAllInstalling(params);
      return res.values.map((items) => ({
        value: items.id,
        label: items.name
      }))
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
  const { isError, isLoading, isFetching, data, error, refetch,
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

  return { isError, isLoading, isFetching, data, error, refetch };
};