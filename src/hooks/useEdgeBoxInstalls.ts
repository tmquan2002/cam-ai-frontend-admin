import { UseQueryResult, useMutation, useQuery } from "react-query";
import { AddEdgeBoxInstallParams, EdgeBoxInstallAPI, GetEdgeBoxInstallParams } from "../apis/EdgeBoxInstallAPI";
import { CommonResponse } from "../models/CommonResponse";
import { EdgeBoxInstall } from "../models/EdgeBoxInstall";

export const useGetAllInstallsFilter = (params: GetEdgeBoxInstallParams) => {
    const { isError, isLoading, isFetching, data, error,
        refetch,
    }: UseQueryResult<CommonResponse<EdgeBoxInstall>, Error> = useQuery({
        queryKey: ["edgeBoxInstallList", params],
        queryFn: async () => {
            return await EdgeBoxInstallAPI.getAllFilter(params);
        },
    });

    return { isError, isLoading, isFetching, data, error, refetch };
};

// TODO: Change format back to CommonResponse layer
export const useGetAllInstalls = () => {
    const { isError, isLoading, isFetching, data, error,
        refetch,
    }: UseQueryResult<EdgeBoxInstall[], Error> = useQuery({
        queryKey: ["edgeBoxAllInstallList"],
        queryFn: async () => {
            return await EdgeBoxInstallAPI.getAll();
        },
    });

    return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetInstallById = (id: string) => {
    const { isError, isLoading, isFetching, data, error, refetch,
    }: UseQueryResult<EdgeBoxInstall, Error> = useQuery({
        queryKey: ["edgeBoxDetail", id],
        queryFn: async () => {
            if (id) {
                return await EdgeBoxInstallAPI.getById(id);
            } else {
                return {}
            }
        },
        enabled: !!id,
    });

    return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetInstallByEdgeBoxId = (edgeBoxId: string) => {
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

export const useGetInstallByShopId = (shopId: string) => {
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