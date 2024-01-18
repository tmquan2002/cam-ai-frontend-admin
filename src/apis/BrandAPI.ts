import { getAccessToken } from "../context/AuthContext";
import { BrandStatus } from "../models/Brand";
import http, { toQueryParams } from "../utils/http";

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
  brandId?: string;
  size?: string | number | null;
  pageIndex?: number;
};

export type GetBrandsPagingResult = {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  isValuesEmpty: boolean;
  values: GetBrandsResult[];
};
export type AddBrandParams = {
  name: string;
  email: string;
  phone: string;
};

export type UpdateBrandParams = {
  id: string;
  values: {
    name: string;
    email: string;
    phone: string;
  }
};

export const BrandAPI = {
  getAllFilter: async (params: GetBrandsParams) => {
    const token = getAccessToken();
    const res = await http.get<GetBrandsPagingResult>(
      `/api/brands?${toQueryParams(params)}`,
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
    const res = await http.get<GetBrandsResult>(`/api/brands/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
  add: async (params: AddBrandParams) => {
    const token = getAccessToken();
    const res = await http.post<GetBrandsResult>("/api/brands", params, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
  update: async (params: UpdateBrandParams) => {
    const token = getAccessToken();
    const res = await http.put<GetBrandsResult>(`/api/brands/${params.id}`, params.values, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
  delete: async (id: string) => {
    const token = getAccessToken();
    const res = await http.delete(`/api/brands/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
  reactivate: async (id: string) => {
    const token = getAccessToken();
    const res = await http.put(`/api/brands/${id}/reactivate`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
};
