import { createContext, useContext, useEffect } from "react";
import { AuthToken } from "../models/Auth";
import { RoleDetail, getIdFromToken, getRolesFromToken } from "../utils/jwt";
import { useStorageState } from "../hooks/useStorageState";
import { CommonConstant } from "../types/constant";
import http from "../utils/http";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<{
  signIn: (params: AuthToken) => void;
  signOut: () => void;
  session?: string | null;
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

export function getUserRoles(): RoleDetail[] | null {
  const accessToken: string | null = getAccessToken();

  if (accessToken) {
    const roles: RoleDetail[] = getRolesFromToken(accessToken);
    return roles;
  }

  return null;
}

export function getUserId(): string | null {
  const accessToken: string | null = getAccessToken();
  if (accessToken) {
    const id: string = getIdFromToken(accessToken);
    return id;
  }

  return null;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState(
    CommonConstant.SESSION
  );
  const [[isAccessTokenLoading, accessToken], setAccessToken] = useStorageState(
    CommonConstant.USER_ACCESS_TOKEN
  );
  const [[isRefreshTokenLoading, refreshToken], setRefreshToken] =
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
        const {
          config,
          response: { status },
        } = err;
        const isAlreadyFetchingAccessToken = localStorage.getItem(
          CommonConstant.IS_ALREADY_FETCHING_ACCESS
        );

        const originalRequest = config;

        if (status == 401) {
          if (err.response.headers.auto == "True") {
            if (!isAlreadyFetchingAccessToken) {
              localStorage.setItem(
                CommonConstant.IS_ALREADY_FETCHING_ACCESS,
                "true"
              );

              await axios
                .post("/api/auth/refresh", {
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                })
                .then((res) => {
                  setAccessToken(res?.data);
                })
                .catch(async (err) => {
                  console.log(err);

                  setAccessToken(null);
                  setRefreshToken(null);
                  setSession(null);
                  //   router.replace("/");
                  navigate("/");
                })
                .finally(async () => {
                  localStorage.removeItem(
                    CommonConstant.IS_ALREADY_FETCHING_ACCESS
                  );
                });
            }
            const retryOriginalRequest = new Promise((resolve) => {
              console.log("call origin req");
              originalRequest.headers["Authorization"] = accessToken;
              resolve(http(originalRequest));
            });

            return retryOriginalRequest;
          } else {
            navigate("/");
          }
        }

        if (err.response) {
          return err.response.data;
        } else {
          return Promise.reject(err);
        }
      }
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: ({ accessToken, refreshToken }: AuthToken) => {
          // Perform sign-in logic here
          setSession("user_session");
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          navigate("/dashboard");
        },
        signOut: () => {
          setAccessToken(null);
          setRefreshToken(null);
          setSession(null);
          navigate("/");
        },
        session: session,
        isLoading: isLoading || isAccessTokenLoading || isRefreshTokenLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
