import { getAccessToken } from "../context/AuthContext";
import { CommonResponse } from "../models/CommonResponse";
import { Shop } from "../models/Shop";
import http, { toQueryParams } from "../utils/http";

export type GetShopsParams = {
  name?: string;
  phone?: string;
  wardId?: string;
  status?: string;
  brandId?: string | null;
  shopManagerId?: string;
  pageIndex?: number;
  size?: string | number | null;
};

export const ShopAPI = {
  getAllFilter: async (params: GetShopsParams) => {
    const token = getAccessToken();
    const res = await http.get<CommonResponse<Shop>>(
      `/api/shops?${toQueryParams(params)}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return res.data;
  },
  //Note: q means that this shop has edge box installing or not
  getAllInstalling: async (params: { q: boolean }) => {
    const token = getAccessToken();
    const res = await http.get<CommonResponse<Shop>>(
      `/api/shops/installing?${toQueryParams(params)}`,
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
    const res = await http.get<Shop>(`/api/shops/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
};
