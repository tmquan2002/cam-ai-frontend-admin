import { getAccessToken } from "../context/AuthContext";
import { Shop } from "../models/Shop";
import http, { toQueryParams } from "../utils/http";

export type GetShopsParams = {
  name?: string;
  phone?: string;
  wardId?: string;
  statusId?: string;
  brandId?: string;
  shopManagerId?: string;
  pageIndex?: number;
  size?: string | number | null;
};

export type GetShopsPagingResult = {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  isValuesEmpty: boolean;
  values: Shop[];
};

export const ShopAPI = {
  getAllFilter: async (params: GetShopsParams) => {
    const token = getAccessToken();
    const res = await http.get<GetShopsPagingResult>(
      `/api/shops?${toQueryParams(params)}`,
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
