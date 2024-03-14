import { UseQueryResult, useQuery } from "react-query";
import { EmployeeAPI, GetEmployeeParams } from "../apis/EmployeeAPI";
import { CommonResponse } from "../models/CommonResponse";
import { Employee } from "../models/Employee";

export const useGetAllEmployees = (params: GetEmployeeParams) => {
  const { isError, isLoading, isFetching, data, error,
    refetch,
  }: UseQueryResult<CommonResponse<Employee>, Error> = useQuery({
    queryKey: ["employeeList", params.size, params.pageIndex],
    queryFn: async () => {
      return await EmployeeAPI.getAllFilter(params);
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

export const useGetEmployeeById = (id: string) => {
  const { isError, isLoading, data, error, refetch,
  }: UseQueryResult<Employee, Error> = useQuery({
    queryKey: ["employeeDetail", id],
    queryFn: async () => {
      return await EmployeeAPI.getById(id);
    },
  });

  return { isError, isLoading, data, error, refetch };
};