import { UseQueryResult, useQuery } from "react-query";
import { LocationAPI } from "../apis/LocationAPI";


export const useGetProvinces = () => {
    const { isError, isLoading, data, error, refetch,
    }: UseQueryResult<SelectType[], Error> = useQuery({
        queryKey: ["provinces"],
        queryFn: async () => {
            const res = await LocationAPI.getProvinces();
            return res.map((items) => ({
                value: items.id.toString(),
                label: items.name
            }))
        },
    });

    return { isError, isLoading, data, error, refetch };
};

export const useGetDistricts = (provinceId: string) => {
    const { isError, isLoading, isFetching, data, error, refetch,
    }: UseQueryResult<SelectType[], Error> = useQuery({
        queryKey: ["districts", provinceId],
        queryFn: async () => {
            const res = await LocationAPI.getDistrictsByProvinceId(provinceId);
            return res.map((items) => ({
                value: items.id.toString(),
                label: items.name
            }))
        },
        enabled: provinceId !== ""
    });

    return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetWards = (districtId: string) => {
    const { isError, isLoading, isFetching, data, error, refetch,
    }: UseQueryResult<SelectType[], Error> = useQuery({
        queryKey: ["wards", districtId],
        queryFn: async () => {
            const res = await LocationAPI.getWardsByDistrictId(districtId);
            return res.map((items) => ({
                value: items.id.toString(),
                label: items.name
            }))
        },
        enabled: districtId !== ""
    });

    return { isError, isLoading, isFetching, data, error, refetch };
};