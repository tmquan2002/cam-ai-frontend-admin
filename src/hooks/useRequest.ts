import { UseQueryResult, useQuery } from "react-query";
import { GetRequestsParams, RequestAPI } from "../apis/RequestAPI";
import { CommonResponse } from "../models/CommonResponse";
import { Request } from "../models/Request";

export const useGetAllRequests = (params: GetRequestsParams) => {
    const { isError, isLoading, isFetching, data, error, refetch,
    }: UseQueryResult<CommonResponse<Request>, Error> = useQuery({
        queryKey: ["requestList", params.size, params.pageIndex],
        queryFn: async () => {
            return await RequestAPI.getAllFilter(params);
        },
    });

    return { isError, isLoading, isFetching, data, error, refetch };
};