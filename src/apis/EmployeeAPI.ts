import { getAccessToken } from "../context/AuthContext";
import { Employee } from "../models/Employee";
import http, { toQueryParams } from "../utils/http";

export type GetEmployeeParams = {
  search?: string;
  employeeStatus?: string;
  brandId?: string;
  shopId?: string;
  size?: string | number | null;
  pageIndex?: number;
};

export type GetEmployeesPagingResult = {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  isValuesEmpty: boolean;
  values: Employee[];
};

export const EmployeeAPI = {
  getAllFilter: async (params: GetEmployeeParams) => {
    const token = getAccessToken();
    const res = await http.get<GetEmployeesPagingResult>(
      `/api/employees?${toQueryParams(params)}`,
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
    const res = await http.get<Employee>(`/api/employees/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
};
