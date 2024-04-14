import { UseQueryResult, useMutation, useQuery } from "react-query";
import { AddEdgeBoxParams, EdgeBoxAPI, EdgeBoxActivityParams, GetEdgeBoxParams, UpdateEdgeBoxParams } from "../apis/EdgeBoxAPI";
import { CommonResponse } from "../models/CommonResponse";
import { EdgeBox, EdgeBoxActivity } from "../models/EdgeBox";
import { EdgeBoxLocationStatus, EdgeBoxStatus } from "../types/enum";

export const useGetAllEdgeBoxes = (params: GetEdgeBoxParams) => {
  const { isError, isLoading, isFetching, data, error,
    refetch,
  }: UseQueryResult<CommonResponse<EdgeBox>, Error> = useQuery({
    queryKey: ["edgeBoxList", params.size, params.pageIndex],
    queryFn: async () => {
      return await EdgeBoxAPI.getAllFilter(params);
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetAllEdgeBoxesSelect = (params: GetEdgeBoxParams) => {
  const { isError, isLoading, isFetching, data, error, refetch,
  }: UseQueryResult<SelectType[], Error> = useQuery({
    queryKey: ["edgeBoxListSelect"],
    queryFn: async () => {
      const res = await EdgeBoxAPI.getAllFilter(params);
      return res.values.map((items) => ({
        value: items.id,
        label: items.name
      }))
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetEdgeBoxById = (id: string | undefined) => {
  const { isError, isLoading, isFetching, data, error, refetch,
  }: UseQueryResult<EdgeBox, Error> = useQuery({
    queryKey: ["edgeBoxDetail", id],
    queryFn: async () => {
      if (id) {
        return await EdgeBoxAPI.getById(id);
      } else {
        return {}
      }
    },
    enabled: !!id,
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetEdgeBoxModel = () => {
  const { isError, isLoading, isFetching, data, error, refetch,
  }: UseQueryResult<SelectType[], Error> = useQuery({
    queryKey: ["edgeBoxModel"],
    queryFn: async () => {
      const res = await EdgeBoxAPI.getEdgeBoxModel();
      return res.map((items) => ({
        value: items.id,
        label: items.name
      }))
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
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
      return await EdgeBoxAPI.updateInfo(params);
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

export const useUpdateEdgeBoxStatus = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "updateEdgeBoxStatus",
    mutationFn: async (params: { id: string; values: { status: EdgeBoxStatus } }) => {
      return await EdgeBoxAPI.updateStatus(params);
    },
  });

  return { mutate, isLoading, error, data };
};

export const useUpdateEdgeBoxLocation = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "updateEdgeBoxStatus",
    mutationFn: async (params: { id: string; values: { location: EdgeBoxLocationStatus } }) => {
      return await EdgeBoxAPI.updateLocation(params);
    },
  });

  return { mutate, isLoading, error, data };
};

export const useGetEdgeBoxActivitiesByEdgeBoxId = (params: EdgeBoxActivityParams) => {
  const { isError, isLoading, isFetching, data, error, refetch,
  }: UseQueryResult<CommonResponse<EdgeBoxActivity>, Error> = useQuery({
    queryKey: ["edgeBoxActivityList", params.edgeBoxId],
    queryFn: async () => {
      if (params.edgeBoxId) {
        return await EdgeBoxAPI.getActivitiesByEdgeBoxId(params);
      } else {
        return {}
      }
    },
    enabled: !!params.edgeBoxId,
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};