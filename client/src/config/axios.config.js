import axios from "axios";
import { store } from "../store/store";
import { logout } from "../store/slices/authSlice";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, wait for the new token
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        isRefreshing = false;
        onRefreshed(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        isRefreshing = false;
        refreshSubscribers = [];

        // Clear auth and redirect
        localStorage.removeItem("accessToken");
        store.dispatch(logout());

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
