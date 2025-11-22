import axiosInstance from "../config/axios.config";

export const fileAPI = {
  // Upload file
  uploadFile: async (formData, onUploadProgress) => {
    const response = await axiosInstance.post("/api/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    return response.data;
  },

  // Get all user files
  getUserFiles: async (params = {}) => {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      order = "desc",
      folder,
    } = params;
    const queryParams = new URLSearchParams({
      page,
      limit,
      sortBy,
      order,
      ...(folder && { folder }),
    });

    const response = await axiosInstance.get(`/api/files?${queryParams}`);
    return response.data;
  },

  // Preview file
  previewFile: async (fileId) => {
    const response = await axiosInstance.get(`/api/files/preview/${fileId}`);
    return response.data;
  },

  // Download file
  downloadFile: async (fileId) => {
    const response = await axiosInstance.get(`/api/files/download/${fileId}`);
    return response.data;
  },

  // Delete file
  deleteFile: async (fileId) => {
    const response = await axiosInstance.delete(`/api/files/${fileId}`);
    return response.data;
  },

  // Create folder
  createFolder: async (folderName) => {
    const response = await axiosInstance.post("/api/files/folder", {
      folderName,
    });
    return response.data;
  },

  // Share file
  shareFile: async (fileId) => {
    const response = await axiosInstance.post(`/api/files/share/${fileId}`);
    return response.data;
  },

  // Search files
  searchFiles: async (query, folder) => {
    const params = new URLSearchParams({ query });
    if (folder) params.append("folder", folder);

    const response = await axiosInstance.get(`/api/files/search?${params}`);
    return response.data;
  },
};
