import { getAccessToken } from "../context/AuthContext";
import { CommonResponse } from "../models/CommonResponse";
import { EdgeBoxInstall } from "../models/EdgeBoxInstall";
import { EdgeBoxActivationStatus, EdgeBoxInstallStatus } from "../types/enum";
import http, { toQueryParams } from "../utils/http";

export type GetEdgeBoxInstallParams = {
    edgeBoxId?: string;
    edgeBoxInstallStatus?: EdgeBoxInstallStatus;
    shopId?: string;
    activationStatus?: EdgeBoxActivationStatus;
    size?: string | number | null;
    pageIndex?: number;
};
export type AddEdgeBoxInstallParams = {
    edgeBoxId: string;
    shopId: string;
    ipAddress?: string;
    port?: number;
}


export const EdgeBoxInstallAPI = {
    getAllFilter: async (params: GetEdgeBoxInstallParams) => {
        const token = getAccessToken();
        const res = await http.get<CommonResponse<EdgeBoxInstall>>(
            `/api/edgeboxinstalls/search?${toQueryParams(params)}`,
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
        const res = await http.get<EdgeBoxInstall>(`/api/edgeboxinstalls/${id}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
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
    install: async (params: AddEdgeBoxInstallParams) => {
        const access_token = getAccessToken();
        const res = await http.post(`/api/edgeboxinstalls`, params, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return res.data;
    },
    uninstall: async (edgeBoxId: string) => {
        const token = getAccessToken();
        await http.put(`/api/edgeboxinstalls/${edgeBoxId}/uninstall`, {}, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
    },
}