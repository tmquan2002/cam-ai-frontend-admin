import { getAccessToken } from "../context/AuthContext";
import { CommonResponse } from "../models/CommonResponse";
import http, { toQueryParams } from "../utils/http";

export type GetRequestsParams = {
    type?: string;
    accountId?: string;
    brandId?: string;
    shopId?: string;
    edgeBoxId?: string;
    hasReply?: boolean
    status?: string;
    size?: string | number | null;
    pageIndex?: number;
}

export type UpdateStatusReplyParams = {
    id: string;
    values: {
        reply: string;
        requestStatus: string;
    }
}

// TODO: Create request UI for admin
export const RequestAPI = {
    getAllFilter: async (params: GetRequestsParams) => {
        const token = getAccessToken();
        const res = await http.get<CommonResponse<Request>>(
            `/api/requests?${toQueryParams(params)}`,
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
            }
        );
        return res.data;
    },
    updateStatusReply: async (params: UpdateStatusReplyParams) => {
        const token = getAccessToken();
        const res = await http.patch<Request>(`/api/requests/${params.id}`, params.values, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
};