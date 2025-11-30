import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: false,
  uploadModalOpen: false,
  createFolderModalOpen: false,
  shareModalOpen: false,
  deleteModalOpen: false,
  previewModalOpen: false,
  selectedFileForAction: null,
  theme: "light",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    openUploadModal: (state) => {
      state.uploadModalOpen = true;
    },
    closeUploadModal: (state) => {
      state.uploadModalOpen = false;
    },
    openCreateFolderModal: (state) => {
      state.createFolderModalOpen = true;
    },
    closeCreateFolderModal: (state) => {
      state.createFolderModalOpen = false;
    },
    openShareModal: (state, action) => {
      state.shareModalOpen = true;
      state.selectedFileForAction = action.payload;
    },
    closeShareModal: (state) => {
      state.shareModalOpen = false;
      state.selectedFileForAction = null;
    },
    openDeleteModal: (state, action) => {
      state.deleteModalOpen = true;
      state.selectedFileForAction = action.payload;
    },
    closeDeleteModal: (state) => {
      state.deleteModalOpen = false;
      state.selectedFileForAction = null;
    },
    openPreviewModal: (state, action) => {
      state.previewModalOpen = true;
      state.selectedFileForAction = action.payload;
    },
    closePreviewModal: (state) => {
      state.previewModalOpen = false;
      state.selectedFileForAction = null;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openUploadModal,
  closeUploadModal,
  openCreateFolderModal,
  closeCreateFolderModal,
  openShareModal,
  closeShareModal,
  openDeleteModal,
  closeDeleteModal,
  openPreviewModal,
  closePreviewModal,
  toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
