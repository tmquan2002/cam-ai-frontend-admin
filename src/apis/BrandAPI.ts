import { TOKEN } from "../constants/LocalStorageItems";
import { getAccessToken } from "../context/AuthContext";
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
export type AddBrandParams = {
  name: string;
  email: string;
  phone: string;
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
    const res = await http.get<GetBrandsPagingResult>(`/api/brands?${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
  add: async (params: AddBrandParams) => {
    const res = await http.post<GetBrandsResult>("/api/brands", params);
    return res.data;
  },
  update: async (id: string) => {
    const token = getAccessToken();
    const res = await http.put<GetBrandsResult>(`/api/brands?${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
  delete: async (id: string) => {
    const token = getAccessToken();
    const res = await http.delete(`/api/brands?${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
  reactivate: async (id: string) => {
    const token = getAccessToken();
    const res = await http.put(`/api/brands?${id}/reactivate`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
};
