import { UseQueryResult, useMutation, useQuery } from "react-query";
import { AddEdgeBoxParams, EdgeBoxAPI, GetEdgeBoxParams, GetEdgeBoxesPagingResult, UpdateEdgeBoxParams } from "../apis/EdgeBoxAPI";
import { EdgeBox } from "../models/EdgeBox";

export const useGetAllEdgeBoxes = (params: GetEdgeBoxParams) => {
  const {
    isError,
    isLoading,
    isFetching,
    data,
    error,
    refetch,
  }: UseQueryResult<GetEdgeBoxesPagingResult, Error> = useQuery({
    queryKey: ["edegBoxList", params.size, params.pageIndex],
    queryFn: async () => {
      return await EdgeBoxAPI.getAllFilter(params);
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetAllEdgeBoxesSelect = (params: GetEdgeBoxParams) => {
  const { isError, isLoading, isFetching, data, error, refetch,
  }: UseQueryResult<SelectType[], Error> = useQuery({
    queryKey: ["edegBoxListSelect"],
    queryFn: async () => {
      const res = await EdgeBoxAPI.getAllFilter(params);
      return res.values.map((items) => ({
        value: items.id,
        label: items.model
      }))
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetEdgeBoxById = (id: string) => {
  const {
    isError,
    isLoading,
    data,
    error,
    refetch,
  }: UseQueryResult<EdgeBox, Error> = useQuery({
    queryKey: ["edegBoxDetail", id],
    queryFn: async () => {
      return await EdgeBoxAPI.getById(id);
    },
  });

  return { isError, isLoading, data, error, refetch };
};

export const useAddEdgeBox = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "addEdgeBox",
    mutationFn: async (params: AddEdgeBoxParams) => {
      return await EdgeBoxAPI.add(params);
    },
  });

  return { mutate, isLoading, error, data };
};

export const useUpdateEdgeBox = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "updateEdgeBox",
    mutationFn: async (params: UpdateEdgeBoxParams) => {
      return await EdgeBoxAPI.update(params);
    },
  });

  return { mutate, isLoading, error, data };
};

export const useDeleteEdgeBox = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "deleteEdgeBox",
    mutationFn: async (id: string) => {
      return await EdgeBoxAPI.delete(id);
    },
  });

  return { mutate, isLoading, error, data };
};