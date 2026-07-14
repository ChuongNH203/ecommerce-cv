import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";

const BASE_URL = "http://localhost:3000";

const axiosInstanceL = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload & { exp?: number }>(token);
    const currentTime = Date.now() / 1000;
    return typeof decoded.exp === "number" && decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

axiosInstanceL.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstanceL;
