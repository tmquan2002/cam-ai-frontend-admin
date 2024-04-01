import _ from "lodash";
import { AuthAPI } from "../apis/AuthAPI";
import { getAccessToken, getRefreshToken } from "../context/AuthContext";
import { setHeaderToken } from "../utils/http";
import { CommonConstant } from "../types/constant";



export const refreshAuth = async (failedRequest: any) => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken()

    if(_.isEmpty(accessToken) || _.isEmpty(refreshToken)) {
        localStorage.clear();

    }

    const newToken = await AuthAPI.refresh({
        accessToken: getAccessToken() ?? "",
        refreshToken: getRefreshToken() ?? ""
    });
  
    if (newToken) {
      failedRequest.response.config.headers.Authorization = "Bearer " + newToken;
      setHeaderToken(newToken);
      localStorage.setItem(CommonConstant.USER_ACCESS_TOKEN, newToken)
      return Promise.resolve(newToken);
    } else {
        localStorage.clear()
      return Promise.reject();
    }
  };