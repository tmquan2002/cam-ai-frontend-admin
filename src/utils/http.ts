import axios, { AxiosInstance } from "axios";

class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_VITE_SERVER_LINK,
      // TODO: Testing and Styling, please change this back to 10000 later
      timeout: 100000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export const toQueryParams = (data: any): string => {
  const qs = Object.keys(data)
    .map((key) =>
      Array.isArray(data[key])
        ? data[key].map((v: string) => `${key}=${v}`).join("&")
        : `${key}=${data[key]}`
    )
    .join("&");

  return qs;
};

const http = new Http().instance;

export default http;
