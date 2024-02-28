import { getAccessToken } from "../context/AuthContext";
import { Notification } from "../models/Notification";
import http, { toQueryParams } from "../utils/http";

export type GetNotificationParams = {
    accountId: string;
    notificationId: string;
    status?: string;
    size?: string | number | null;
    pageIndex?: number;
};

export type GetNotificationesPagingResult = {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    isValuesEmpty: boolean;
    values: Notification[];
};

export type AddNotificationParams = {
    title: string;
    notificationTypeId?: number;
    content: string;
    sentToId?: string[];
}

export type UpdateNotificationParams = {
    notificationId: string;
    statusId: string;
};

export const NotificationAPI = {
    getAllFilter: async (params: GetNotificationParams) => {
        const token = getAccessToken();
        const res = await http.get<GetNotificationesPagingResult>(
            `/api/notifications?${toQueryParams(params)}`,
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
            }
        );
        return res.data;
    },
    add: async (params: AddNotificationParams) => {
        const token = getAccessToken();
        const res = await http.post<Notification>("/api/notifications", params, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
    patch: async (params: UpdateNotificationParams) => {
        const token = getAccessToken();
        const res = await http.patch<Notification>(`/api/notifications/${params.notificationId}/status/${params.statusId}`, {}, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
};
