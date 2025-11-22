import axiosInstance from "../config/axios.config";

export const authAPI = {
  // Register new user
  register: async (data) => {
    const response = await axiosInstance.post("/api/auth/register", data);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await axiosInstance.post("/api/auth/login", credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await axiosInstance.post("/api/auth/logout");
    return response.data;
  },

  // Refresh access token
  refreshToken: async () => {
    const response = await axiosInstance.post("/api/auth/refresh-token");
    return response.data;
  },
};
