import { TOKEN } from "../constants/LocalStorageItems";
import { BrandStatus } from "../models/Brand";
import { getToken } from "../utils/LocalStorageUtil";
import http, { toQueryParams } from "../utils/http";

//TODO: Searchbar Param
// export type SearchBrandParams = {
//     direction?: string,
//     page?: number;
//     pageSize?: number;
//     name?: string;
//     orderBy?: string;
//     lowerDate?: string;
//     upperDate?: string;
// };

export type GetBrandsResult = {
    id: string;
    createdDate: string;
    modifiedDate: string;
    timestamp: string;
    name: string;
    email: string;
    phone: string;
    logoUri: string;
    bannerUri: string;
    brandManagerId: string;
    brandStatus: BrandStatus;
};

export type GetBrandsParams = {
    statusId?: number;
    name?: string;
    size?: number;
    pageIndex: number;
};

export type GetBrandsPagingResult = {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    values: GetBrandsResult[];
};

export const BrandAPI = {
    getBrands: async (params: GetBrandsParams) => {
        const token = getToken();
        const accessToken = token?.accessToken
        const res = await http.get<GetBrandsPagingResult>(
            `/api/brands?${toQueryParams(params)}`,
            {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            }
        );
        return res.data;
    },
}