import { UseQueryResult, useQuery } from "react-query";
import { ReportEdgeBox, ReportEdgeBoxInstall } from "../models/Report";
import { ReportAPI } from "../apis/ReportAPI";

export const useGetEdgeBoxReport = () => {
    const { isError, isLoading, isFetching, data, error, refetch,
    }: UseQueryResult<ReportEdgeBox, Error> = useQuery({
        queryKey: ["reportEdgeBox"],
        queryFn: async () => {
            return await ReportAPI.getEdgeBoxReport();
        },
    });

    return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetEdgeBoxInstallReport = () => {
    const { isError, isLoading, isFetching, data, error, refetch,
    }: UseQueryResult<ReportEdgeBoxInstall, Error> = useQuery({
        queryKey: ["reportInstallEdgeBox"],
        queryFn: async () => {
            return await ReportAPI.getEdgeBoxInstallReport();
        },
    });

    return { isError, isLoading, isFetching, data, error, refetch };
};