import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Breadcrumb from "../components/Breadcrumb";
import FileGrid from "../components/FileGrid";
import FileList from "../components/FileList";
import UploadModal from "../components/modals/UploadModal";
import CreateFolderModal from "../components/modals/CreateFolderModal";
import ShareModal from "../components/modals/ShareModal";
import DeleteModal from "../components/modals/DeleteModal";
import PreviewModal from "../components/modals/PreviewModal";
import { fileAPI } from "../services/file.service";
import {
  setFiles,
  setLoading,
  setError,
  setPagination,
  resetFiles,
} from "../store/slices/fileSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    files,
    viewMode,
    currentFolder,
    sortBy,
    sortOrder,
    searchQuery,
    pagination,
    loading,
  } = useSelector((state) => state.files);
  const { sidebarOpen } = useSelector((state) => state.ui);

  // Clear files and fetch fresh data on mount
  useEffect(() => {
    dispatch(resetFiles());
    fetchFiles();
  }, [currentFolder, pagination.currentPage, sortBy, sortOrder]);

  // Search with debounce
  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      fetchFiles();
    }
  }, [searchQuery]);

  const fetchFiles = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(resetFiles()); // Clear old data before fetching

      // Check if currentFolder is a category filter
      const categories = ["images", "videos", "audio", "documents"];
      const isCategory = categories.includes(currentFolder);

      // For starred and trash, let backend handle it via folder parameter
      // For categories, fetch from root and filter client-side
      const response = await fileAPI.getUserFiles({
        page: pagination.currentPage,
        limit: pagination.limit,
        sortBy,
        order: sortOrder,
        folder: isCategory ? "root" : currentFolder, // Pass starred/trash/folders to backend
      });

      // Filter by category if needed (client-side filtering)
      let filteredFiles = response.files;
      if (isCategory) {
        filteredFiles = filterByCategory(response.files, currentFolder);
      } else if (currentFolder === "folders") {
        filteredFiles = response.files.filter((file) => file.type === "folder");
      }

      dispatch(setFiles(filteredFiles));
      dispatch(
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalFiles: isCategory ? filteredFiles.length : response.totalFiles,
        })
      );
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch files")
      );
      toast.error("Failed to load files");
    }
  };

  // Filter files by category
  const filterByCategory = (filesList, category) => {
    // Exclude folders and trashed items from category views
    const validFiles = filesList.filter(
      (file) => file.type !== "folder" && !file.isTrashed
    );

    switch (category) {
      case "images":
        return validFiles.filter((file) => file.type?.startsWith("image/"));
      case "videos":
        return validFiles.filter((file) => file.type?.startsWith("video/"));
      case "audio":
        return validFiles.filter((file) => file.type?.startsWith("audio/"));
      case "documents":
        return validFiles.filter(
          (file) =>
            file.type?.includes("pdf") ||
            file.type?.includes("document") ||
            file.type?.includes("text") ||
            file.type?.includes("msword") ||
            file.type?.includes("wordprocessingml") ||
            file.type?.includes("spreadsheet") ||
            file.type?.includes("presentation")
        );
      default:
        return validFiles;
    }
  };

  const handleSearch = async () => {
    try {
      dispatch(setLoading(true));
      const response = await fileAPI.searchFiles(
        searchQuery,
        currentFolder !== "root" ? currentFolder : null
      );
      dispatch(setFiles(response.files));
      dispatch(
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalFiles: response.count,
        })
      );
    } catch (error) {
      toast.error("Search failed");
    }
  };

  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onRefresh={fetchFiles} />
        <Breadcrumb />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-dark-border rounded-full"></div>
                <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
            </div>
          ) : files.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-64 text-dark-text-secondary"
            >
              <div className="w-20 h-20 bg-dark-card rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-dark-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-dark-text-primary">
                No files found
              </p>
              <p className="text-sm mt-2">
                Upload your first file to get started
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === "grid" ? (
                <FileGrid files={files} onUpdate={fetchFiles} />
              ) : (
                <FileList files={files} onUpdate={fetchFiles} />
              )}
            </motion.div>
          )}
        </main>
      </div>

      {/* Modals */}
      <UploadModal onUploadSuccess={fetchFiles} />
      <CreateFolderModal onCreateSuccess={fetchFiles} />
      <ShareModal />
      <DeleteModal
        onDeleteSuccess={fetchFiles}
        isPermanent={currentFolder === "trash"}
      />
      <PreviewModal />
    </div>
  );
};

export default Dashboard;
