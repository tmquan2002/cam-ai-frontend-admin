import { getAccessToken } from "../context/AuthContext";
import { Account } from "../models/Account";
import { CommonResponse } from "../models/CommonResponse";
import { Gender, Role } from "../types/enum";
import http, { toQueryParams } from "../utils/http";

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

export type AddAccountParams = {
  email: string;
  name: string;
  gender: Gender | null;
  phone: string | null;
  birthday: string | null;
  wardId: string | null;
  addressLine: string;
  brandId: string | null;
  role: Role;
};

export type UpdateAccountParams = {
  id: string;
  values: {
    name: string;
    gender: Gender | null;
    email: string;
    phone: string;
    birthday: string | null;
    wardId: string | null;
    addressLine: string;
  };
};

export const AccountAPI = {
  getAllFilter: async (params: GetAccountsParams) => {
    const token = getAccessToken();
    const res = await http.get<CommonResponse<Account>>(
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
    const res = await http.post<Account>("/api/accounts", params, {
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
  activate: async (id: string) => {
    const token = getAccessToken();
    const res = await http.put(`/api/accounts/${id}/activate`, {}, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res?.data;
  },
};
