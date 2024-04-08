import { getAccessToken } from "../context/AuthContext";
import { CommonResponse } from "../models/CommonResponse";
import { EdgeBox, EdgeBoxActivity, EdgeBoxInstall, EdgeBoxModel } from "../models/EdgeBox";
import { EdgeBoxLocationStatus, EdgeBoxStatus } from "../types/enum";
import http, { toQueryParams } from "../utils/http";

export type GetEdgeBoxParams = {
    name?: string;
    edgeBoxStatus?: number | string;
    edgeBoxLocation?: string;
    brandId?: string;
    shopId?: string;
    size?: string | number | null;
    pageIndex?: number;
};

export type AddEdgeBoxParams = {
    name: string;
    edgeBoxModelId: string | null;
}

export type UpdateEdgeBoxParams = {
    id: string;
    values: {
        name: string;
        edgeBoxModelId: string | null;
    }
};

export type EdgeBoxActivityParams = {
    edgeBoxId: string;
    values: {
        size?: string | number | null;
        pageIndex?: number;
    }
};

export type AddEdgeBoxInstallParams = {
    edgeBoxId: string;
    shopId: string;
    ipAddress?: string;
    port?: number;
}

export const EdgeBoxAPI = {
    getAllFilter: async (params: GetEdgeBoxParams) => {
        const token = getAccessToken();
        const res = await http.get<CommonResponse<EdgeBox>>(
            `/api/edgeboxes?${toQueryParams(params)}`,
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
            }
        );
        return res.data;
    },
    getEdgeBoxModel: async () => {
        const res = await http.get<EdgeBoxModel[]>(`/api/edgeboxmodels`);
        return res.data;
    },
    getEdgeBoxInstallsByEdgeBoxId: async (edgeBoxId: string) => {
        const token = getAccessToken();
        const res = await http.get<CommonResponse<EdgeBoxInstall>>(`/api/edgeboxes/${edgeBoxId}/installs`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
    getEdgeBoxInstallsByShopId: async (shopId: string) => {
        const token = getAccessToken();
        const res = await http.get<CommonResponse<EdgeBoxInstall>>(`/api/shops/${shopId}/installs`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
    getById: async (id: string) => {
        const token = getAccessToken();
        const res = await http.get<EdgeBox>(`/api/edgeboxes/${id}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
    getActivitiesByEdgeBoxId: async (params: EdgeBoxActivityParams) => {
        const token = getAccessToken();
        const res = await http.get<CommonResponse<EdgeBoxActivity>>(`/api/edgeboxes/${params.edgeBoxId}/activities?${toQueryParams(params.values)}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
    add: async (params: AddEdgeBoxParams) => {
        const token = getAccessToken();
        const res = await http.post<EdgeBox>("/api/edgeboxes", params, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
    updateInfo: async (params: UpdateEdgeBoxParams) => {
        const token = getAccessToken();
        const res = await http.put<EdgeBox>(`/api/edgeboxes/${params.id}`, params.values, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
    delete: async (id: string) => {
        const token = getAccessToken();
        const res = await http.delete(`/api/edgeboxes/${id}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
    install: async (params: AddEdgeBoxInstallParams) => {
        const access_token = getAccessToken();
        const res = await http.post(`/api/edgeboxinstalls`, params, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return res.data;
    },
    updateStatus: async (params: { id: string; values: { status: EdgeBoxStatus } }) => {
        const token = getAccessToken();
        await http.put(`/api/edgeboxes/${params.id}/status`, params.values, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
    },
    updateLocation: async (params: { id: string; values: { location: EdgeBoxLocationStatus } }) => {
        const token = getAccessToken();
        await http.put(`/api/edgeboxes/${params.id}/location`, params.values, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
    },
};
