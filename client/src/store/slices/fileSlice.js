import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  files: [],
  currentFolder: "root",
  folderPath: ["root"],
  viewMode: "grid", // 'grid' or 'list'
  sortBy: "createdAt",
  sortOrder: "desc",
  searchQuery: "",
  selectedFiles: [],
  uploadProgress: {},
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalFiles: 0,
    limit: 20,
  },
};

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setFiles: (state, action) => {
      state.files = action.payload;
      state.loading = false;
    },
    addFile: (state, action) => {
      state.files.unshift(action.payload);
    },
    updateFile: (state, action) => {
      const index = state.files.findIndex((f) => f._id === action.payload._id);
      if (index !== -1) {
        state.files[index] = { ...state.files[index], ...action.payload };
      }
    },
    removeFile: (state, action) => {
      state.files = state.files.filter((f) => f._id !== action.payload);
    },
    setCurrentFolder: (state, action) => {
      state.currentFolder = action.payload;
    },
    setFolderPath: (state, action) => {
      state.folderPath = action.payload;
    },
    navigateToFolder: (state, action) => {
      state.currentFolder = action.payload.folderId;
      state.folderPath.push(action.payload.folderName);
    },
    navigateBack: (state) => {
      if (state.folderPath.length > 1) {
        state.folderPath.pop();
        state.currentFolder = state.folderPath[state.folderPath.length - 1];
      }
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleFileSelection: (state, action) => {
      const fileId = action.payload;
      const index = state.selectedFiles.indexOf(fileId);
      if (index > -1) {
        state.selectedFiles.splice(index, 1);
      } else {
        state.selectedFiles.push(fileId);
      }
    },
    clearSelection: (state) => {
      state.selectedFiles = [];
    },
    setUploadProgress: (state, action) => {
      const { fileId, progress } = action.payload;
      state.uploadProgress[fileId] = progress;
    },
    removeUploadProgress: (state, action) => {
      delete state.uploadProgress[action.payload];
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFiles: (state) => {
      state.files = [];
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  setFiles,
  addFile,
  updateFile,
  removeFile,
  setCurrentFolder,
  setFolderPath,
  navigateToFolder,
  navigateBack,
  setViewMode,
  setSortBy,
  setSortOrder,
  setSearchQuery,
  toggleFileSelection,
  clearSelection,
  setUploadProgress,
  removeUploadProgress,
  setPagination,
  setLoading,
  setError,
  clearError,
  resetFiles,
} = fileSlice.actions;

export default fileSlice.reducer;
