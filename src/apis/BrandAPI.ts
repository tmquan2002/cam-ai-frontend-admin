import { getAccessToken } from "../context/AuthContext";
import { Brand } from "../models/Brand";
import { CommonResponse } from "../models/CommonResponse";
import http, { toQueryParams } from "../utils/http";

export type GetBrandsParams = {
  brandStatus?: string;
  name?: string | null;
  brandId?: string;
  size?: string | number | null;
  pageIndex?: number;
  hasManager?: boolean;
};

export type AddBrandParams = {
  name: string;
  email: string;
  phone: string;
  brandWebsite: string;
  description: string;
  wardId: string | null;
  addressLine: string;
  companyName: string;
};

export type UpdateBrandParams = {
  id: string;
  values: {
    name: string;
    email: string;
    phone: string;
    brandWebsite: string;
    description: string;
    companyWardId: string | null;
    companyAddress: string;
    companyName: string;
  }
};

export const BrandAPI = {
  getAllFilter: async (params: GetBrandsParams) => {
    const token = getAccessToken();

    const res = await http.get<CommonResponse<Brand>>(
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
    const res = await http.get<Brand>(`/api/brands/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
  add: async (params: AddBrandParams) => {
    const token = getAccessToken();
    const form = new FormData();
    form.append("Brand.Name", params.name);
    form.append("Brand.Email", params.email);
    form.append("Brand.Phone", params.phone);
    form.append("Brand.Description", params.description);
    form.append("Brand.CompanyName", params.companyName);
    form.append("Brand.BrandWebsite", params.brandWebsite);
    form.append("Brand.CompanyAddress", params.addressLine);
    form.append("Brand.CompanyWardId", params.wardId ?? "");

    const res = await http.post<Brand>(`/api/brands`, form, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
  update: async (params: UpdateBrandParams) => {
    const token = getAccessToken();
    const res = await http.put<Brand>(`/api/brands/${params.id}`, params.values, {
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
    const res = await http.put<Brand>(`/api/brands/${id}/reactivate`, {}, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
};
