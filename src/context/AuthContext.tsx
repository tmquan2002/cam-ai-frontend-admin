import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStorageState } from "../hooks/useStorageState";
import { AuthToken } from "../models/Auth";
import { CommonConstant } from "../types/constant";
import * as jwt from "../utils/jwt";
import http from "../utils/http";
import { Role } from "../types/enum";

const AuthContext = createContext<{
  signIn: (params: AuthToken) => void;
  signOut: () => void;
  isLoading: boolean;
} | null>(null);

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}
export const getAccessToken = (): string | null => {
  const ACCESS_TOKEN = localStorage.getItem(CommonConstant.USER_ACCESS_TOKEN);
  return ACCESS_TOKEN;
};

export const getRefreshToken = (): string | null => {
  const REFRESH_TOKEN = localStorage.getItem(CommonConstant.USER_REFRESH_TOKEN);
  return REFRESH_TOKEN;
};

export function getUserRole(): Role | null {
  const accessToken: string | null = getAccessToken();

  if (accessToken) {
    const role: Role = jwt.getRoleFromToken(accessToken);
    return role;
  }

  return null;
}

export function getUserId(): string | null {
  const accessToken: string | null = getAccessToken();
  if (accessToken) {
    const id: string = jwt.getIdFromToken(accessToken);
    return id;
  }

  return null;
}

export function checkRole(acceptableRoles: string[]): boolean {
  const userRole = getUserRole();
  if (!userRole) return false;

  const arr1 = acceptableRoles.filter((acceptableRole) => {
    return userRole == acceptableRole;
  });

  return arr1.length > 0;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isAccessTokenLoading], setAccessToken] = useStorageState(
    CommonConstant.USER_ACCESS_TOKEN
  );

  const [[isRefreshTokenLoading], setRefreshToken] = useStorageState(
    CommonConstant.USER_REFRESH_TOKEN
  );

  const navigate = useNavigate();

  useEffect(() => {
    http.interceptors.response.use(
      (res) => {
        return res;
      },
      (err) => {
          if (err?.response?.status == 401) {
            if (err?.response?.headers.auto != "True") {
              localStorage.clear();
              navigate("/");
            }
          }

       throw err
      }
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: ({ accessToken, refreshToken }: AuthToken) => {
          // Perform sign-in logic here
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          navigate(0);
        },
        signOut: () => {
          setAccessToken(null);
          setRefreshToken(null);
          navigate("/");
        },
        isLoading: isAccessTokenLoading || isRefreshTokenLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
