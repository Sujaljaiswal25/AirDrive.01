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

  useEffect(() => {
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
      const response = await fileAPI.getUserFiles({
        page: pagination.currentPage,
        limit: pagination.limit,
        sortBy,
        order: sortOrder,
        folder: currentFolder,
      });

      dispatch(setFiles(response.files));
      dispatch(
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalFiles: response.totalFiles,
        })
      );
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch files")
      );
      toast.error("Failed to load files");
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>{sidebarOpen && <Sidebar />}</AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onRefresh={fetchFiles} />
        <Breadcrumb />

        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p className="text-lg">No files found</p>
              <p className="text-sm mt-2">
                Upload your first file to get started
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === "grid" ? (
                <FileGrid files={files} />
              ) : (
                <FileList files={files} />
              )}
            </motion.div>
          )}
        </main>
      </div>

      {/* Modals */}
      <UploadModal onUploadSuccess={fetchFiles} />
      <CreateFolderModal onCreateSuccess={fetchFiles} />
      <ShareModal />
      <DeleteModal onDeleteSuccess={fetchFiles} />
      <PreviewModal />
    </div>
  );
};

export default Dashboard;
