import { UseQueryResult, useMutation, useQuery } from "react-query";
import { AddEdgeBoxInstallParams, EdgeBoxInstallAPI, GetEdgeBoxInstallParams } from "../apis/EdgeBoxInstallAPI";
import { CommonResponse } from "../models/CommonResponse";
import { EdgeBoxInstall } from "../models/EdgeBoxInstall";

export const useGetAllEdgeBoxes = (params: GetEdgeBoxInstallParams) => {
    const { isError, isLoading, isFetching, data, error,
        refetch,
    }: UseQueryResult<CommonResponse<EdgeBoxInstall>, Error> = useQuery({
        queryKey: ["edgeBoxInstallList", params.size, params.pageIndex],
        queryFn: async () => {
            return await EdgeBoxInstallAPI.getAllFilter(params);
        },
    });

    return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetEdgeBoxInstallByEdgeBoxId = (edgeBoxId: string) => {
    const { isError, isLoading, isFetching, data, error, refetch,
    }: UseQueryResult<CommonResponse<EdgeBoxInstall>, Error> = useQuery({
        queryKey: ["edgeBoxInstallList", edgeBoxId],
        queryFn: async () => {
            if (edgeBoxId) {
                return await EdgeBoxInstallAPI.getEdgeBoxInstallsByEdgeBoxId(edgeBoxId);
            } else {
                return {}
            }
        },
        enabled: !!edgeBoxId,
    });

    return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetEdgeBoxInstallByShopId = (shopId: string) => {
    const { isError, isLoading, data, error, refetch,
    }: UseQueryResult<CommonResponse<EdgeBoxInstall>, Error> = useQuery({
        queryKey: ["edgeBoxInstallList", shopId],
        queryFn: async () => {
            if (shopId) {
                return await EdgeBoxInstallAPI.getEdgeBoxInstallsByShopId(shopId);
            } else {
                return {}
            }
        },
        enabled: !!shopId,
    });

    return { isError, isLoading, data, error, refetch };
};

export const useInstallEdgeBox = () => {
    const { mutate, isLoading, error, data } = useMutation({
        mutationKey: "installEdgeBox",
        mutationFn: async (params: AddEdgeBoxInstallParams) => {
            return await EdgeBoxInstallAPI.install(params);
        },
    });

    return { mutate, isLoading, error, data };
};

export const useUninstallEdgeBox = () => {
    const { mutate, isLoading, error, data } = useMutation({
        mutationKey: "updateEdgeBoxStatus",
        mutationFn: async (edgeBoxId: string) => {
            return await EdgeBoxInstallAPI.uninstall(edgeBoxId);
        },
    });

    return { mutate, isLoading, error, data };
};