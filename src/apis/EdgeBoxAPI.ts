import { getAccessToken } from "../context/AuthContext";
import { EdgeBox } from "../models/EdgeBox";
import http, { toQueryParams } from "../utils/http";

export type GetEdgeBoxParams = {
    model?: string;
    edgeBoxStatusId?: number | string;
    edgeBoxLocationId?: string;
    size?: string | number | null;
    pageIndex?: number;
};

export type GetEdgeBoxesPagingResult = {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    isValuesEmpty: boolean;
    values: EdgeBox[];
};

export type AddEdgeBoxParams = {
    username: string;
    password: string;
    name: string;
    edgeBoxModelId: string;
}

export type UpdateEdgeBoxParams = {
    id: string;
    values: {
        name: string;
        edgeBoxModelId: string;
    }
};

export const EdgeBoxAPI = {
    getAllFilter: async (params: GetEdgeBoxParams) => {
        const token = getAccessToken();
        const res = await http.get<GetEdgeBoxesPagingResult>(
            `/api/edgeboxes?${toQueryParams(params)}`,
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
            }
        );
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
    add: async (params: AddEdgeBoxParams) => {
        const token = getAccessToken();
        const res = await http.post<EdgeBox>("/api/edgeboxes", params, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
    update: async (params: UpdateEdgeBoxParams) => {
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
};
