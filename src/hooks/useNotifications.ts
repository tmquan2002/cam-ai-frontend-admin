import { UseQueryResult, useMutation, useQuery } from "react-query";
import { AddNotificationParams, GetNotificationParams, GetNotificationesPagingResult, NotificationAPI, UpdateNotificationParams } from "../apis/NotificationAPI";

export const useGetAllNotifications = (params: GetNotificationParams) => {
  const {
    isError,
    isLoading,
    isFetching,
    data,
    error,
    refetch,
  }: UseQueryResult<GetNotificationesPagingResult, Error> = useQuery({
    queryKey: ["notificationList", params.size, params.pageIndex],
    queryFn: async () => {
      return await NotificationAPI.getAllFilter(params);
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetAllNotificationsSelect = (params: GetNotificationParams) => {
  const { isError, isLoading, isFetching, data, error, refetch,
  }: UseQueryResult<SelectType[], Error> = useQuery({
    queryKey: ["notificationListSelect"],
    queryFn: async () => {
      const res = await NotificationAPI.getAllFilter(params);
      return res.values.map((items) => ({
        value: items.id,
        label: items.title
      }))
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useAddNotification = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "addNotification",
    mutationFn: async (params: AddNotificationParams) => {
      return await NotificationAPI.add(params);
    },
  });

  return { mutate, isLoading, error, data };
};

export const usePatchNotification = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "patchNotification",
    mutationFn: async (params: UpdateNotificationParams) => {
      return await NotificationAPI.patch(params);
    },
  });

  return { mutate, isLoading, error, data };
};