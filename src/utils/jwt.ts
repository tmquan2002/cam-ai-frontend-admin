import { jwtDecode } from "jwt-decode";

export type UserDetail = {
  id: string;
  role: string;
  exp: number;
};

export const getPayloadFromToken = (token: string): UserDetail => {
  const user_detail: UserDetail = jwtDecode(token);
  return user_detail;
};

export const getRoleFromToken = (token: string): string => {
  const role: string = getPayloadFromToken(token).role;
  return role;
};

export const getIdFromToken = (token: string): string => {
  const id: string = getPayloadFromToken(token).id;
  return id;
};
