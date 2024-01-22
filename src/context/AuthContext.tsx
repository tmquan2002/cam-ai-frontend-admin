import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStorageState } from "../hooks/useStorageState";
import { AuthToken } from "../models/Auth";
import { CommonConstant } from "../types/constant";
import http from "../utils/http";
import * as jwt from "../utils/jwt";
import { RoleDetail } from "../utils/jwt";
import { notifications } from "@mantine/notifications";

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

export function getUserRoles(): RoleDetail[] | null {
  const accessToken: string | null = getAccessToken();

  if (accessToken) {
    const roles: jwt.RoleDetail[] = jwt.getRolesFromToken(accessToken);
    return roles;
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

export function checkRole(acceptableRoles: RoleDetail[]): boolean {
  const userRole = getUserRoles();
  if (!userRole) return false;

  const arr1 = acceptableRoles.filter((e) => {
    return userRole.some((item) => item.Id === e.Id);
  });

  // userRole?.forEach((role) => {
  //   if (role.Id == acceptableRole.Id) {
  //     check = true;
  //     return;
  //   }
  // });

  return arr1.length > 0;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isAccessTokenLoading], setAccessToken] = useStorageState(
    CommonConstant.USER_ACCESS_TOKEN
  );

  const [[isRefreshTokenLoading], setRefreshToken] =
    useStorageState(CommonConstant.USER_REFRESH_TOKEN);

  const navigate = useNavigate();

  useEffect(() => {
    http.interceptors.response.use(
      (res) => {
        if (res && res?.data) {
          return res;
        }

        return res;
      },
      async (err) => {
        try {
          if (err?.response?.status == 401) {
            if (err?.response?.headers.auto == "True") {
              const { config } = err;

              const isAlreadyFetchingAccessToken = localStorage.getItem(
                CommonConstant.IS_ALREADY_FETCHING_ACCESS
              );
              const originalRequest = config;

              if (!isAlreadyFetchingAccessToken) {
                localStorage.setItem(
                  CommonConstant.IS_ALREADY_FETCHING_ACCESS,
                  "true"
                );

                const res = await http.post("/api/auth/refresh",
                  {
                    accessToken: getAccessToken(),
                    refreshToken: getRefreshToken(),
                  }
                );

                setAccessToken(res?.data);
              }
              const retryOriginalRequest = new Promise((resolve) => {
                originalRequest.headers[
                  "Authorization"
                ] = `Bearer ${getAccessToken()}`;
                resolve(http(originalRequest));
              });

              return retryOriginalRequest;
            } else {
              throw err;
            }
          }
        } catch (error) {
          setAccessToken(null);
          setRefreshToken(null);
          navigate("/");
          notifications.show({
            message: "Session Timeout. Please login again",
            color: "pale-red.5",
            withCloseButton: true,
          });
        } finally {
          localStorage.removeItem(CommonConstant.IS_ALREADY_FETCHING_ACCESS);
        }

        throw err;
      }
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async ({ accessToken, refreshToken }: AuthToken) => {
          // Perform sign-in logic here
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          navigate(0);
        },
        signOut: () => {
          setAccessToken(null);
          setRefreshToken(null);
          navigate("/");
          notifications.show({
            message: "Session Timeout. Please login again",
            color: "pale-red.5",
            withCloseButton: true,
          });
        },
        isLoading: isAccessTokenLoading || isRefreshTokenLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
