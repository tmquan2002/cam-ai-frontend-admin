import { jwtDecode } from "jwt-decode";
import { RoleEnum } from "../types/enum";

export type UserDetail = {
  id: string;
  role: RoleEnum;
  exp: number;
};

export const getPayloadFromToken = (token: string): UserDetail => {
  const user_detail: UserDetail = jwtDecode(token);
  return user_detail;
};

export const getRoleFromToken = (token: string): RoleEnum => {
  const role: RoleEnum = getPayloadFromToken(token).role;
  return role;
};

export const getIdFromToken = (token: string): string => {
  const id: string = getPayloadFromToken(token).id;
  return id;
};
