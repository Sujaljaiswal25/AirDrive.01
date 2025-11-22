import axiosInstance from "../config/axios.config";

export const profileAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await axiosInstance.get("/api/profile/me");
    return response.data;
  },

  // Update user profile
  updateProfile: async (formData) => {
    const response = await axiosInstance.patch(
      "/api/profile/update",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
