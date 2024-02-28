import { getAccessToken } from "../context/AuthContext";
import { Account } from "../models/Account";
import { Brand } from "../models/Brand";
import { Ward } from "../models/Location";
import { Shop } from "../models/Shop";
import http, { toQueryParams } from "../utils/http";

export type AddAccountResult = {
  timestamp: string;
  id: string;
  createdDate: string;
  modifiedDate: string;
  email: string;
  name: string;
  gender: string;
  phone: string;
  birthday: string;
  wardId: string;
  addressLine: string;
  workingShopId: string;
  ward: Ward;
  workingShop: Shop;
  accountStatus: string;
  brand: Brand;
  managingShop: Shop;
  role: string;
};

export type GetAccountsParams = {
  name?: string;
  email?: string;
  accountStatus?: string;
  role?: string;
  brandId?: string | null;
  shopId?: string;
  size?: string | number | null;
  pageIndex?: number;
};

export type GetAccountsPagingResult = {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  isValuesEmpty: boolean;
  values: Account[];
};

export type AddAccountParams = {
  email: string;
  password: string;
  name: string;
  gender: string;
  phone: string;
  birthday: string;
  wardId: string | null;
  addressLine: string;
  brandId: string | null;
  // workingShopId: string;
  role: string;
};

export type UpdateAccountParams = {
  id: string;
  values: {
    name: string;
    gender: string;
    email: string;
    phone: string;
    birthday: string;
    wardId: string | null;
    addressLine: string;
  };
};

export const AccountAPI = {
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
    const res = await http.get<Account>(`/api/accounts/${id}`, {
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
  update: async (params: UpdateAccountParams) => {
    const token = getAccessToken();
    const res = await http.put<Account>(
      `/api/accounts/${params.id}`,
      params.values,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return res.data;
  },
  delete: async (id: string) => {
    const token = getAccessToken();
    const res = await http.delete(`/api/accounts/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
};
