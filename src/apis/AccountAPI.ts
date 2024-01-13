import { getAccessToken } from "../context/AuthContext";
import { AccountRole, AccountStatus } from "../models/Account";
import { Brand } from "../models/Brand";
import { Ward } from "../models/Location";
import { Shop } from "../models/Shop";
import http, { toQueryParams } from "../utils/http";

export type GetAccountResult = {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    email: string;
    password: string;
    name: string;
    gender: number;
    phone: string;
    birthday: string;
    wardId: string;
    addressLine: string;
    workingShopId: string;
    accountStatusId: number,
    ward: Ward;
    workingShop: Shop;
    accountStatus: AccountStatus;
    brand: Brand;
    managingShop: Shop;
    roles: [AccountRole];
};

export type AddAccountResult = {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    email: string;
    name: string;
    gender: number;
    phone: string;
    birthday: string;
    wardId: string;
    addressLine: string;
    workingShopId: string;
    accountStatusId: number,
    ward: Ward;
    workingShop: Shop;
    accountStatus: AccountStatus;
    brand: Brand;
    managingShop: Shop;
    roles: [AccountRole];
};

export type GetAccountsParams = {
    guid?: string;
    from?: string;
    to?: string;
    pageSize?: string | null;
    pageIndex?: number;
};

export type GetAccountsPagingResult = {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    isValuesEmpty: boolean;
    values: GetAccountResult[];
};

export type AddAccountParams = {
    email: string,
    password: string,
    name: string,
    gender: number,
    phone: string,
    birthday: string,
    wardId: string,
    addressLine: string,
    brandId: string,
    workingShopId: string,
    roleIds: [number]
};

export const BrandAPI = {
    getAllFilter: async (params: GetAccountsParams) => {
        const token = getAccessToken();
        const res = await http.get<GetAccountsPagingResult>(
            `/api/accounts?${toQueryParams(params)}`,
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
        const res = await http.get<GetAccountResult>(`/api/accounts/${id}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
    add: async (params: AddAccountParams) => {
        const token = getAccessToken();
        const res = await http.post<AddAccountResult>("/api/accounts", params, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
};
