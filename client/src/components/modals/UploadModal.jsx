import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, File, Loader2, Folder, Check } from "lucide-react";
import toast from "react-hot-toast";
import { closeUploadModal } from "../../store/slices/uiSlice";
import { fileAPI } from "../../services/file.service";

const UploadModal = ({ onUploadSuccess }) => {
  const dispatch = useDispatch();
  const { uploadModalOpen } = useSelector((state) => state.ui);
  const { currentFolder, files } = useSelector((state) => state.files);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  // Get current folder name
  const getCurrentFolderName = () => {
    if (currentFolder === "root") return "All Files";
    const folder = files.find(
      (f) => f._id === currentFolder && f.type === "folder"
    );
    return folder ? folder.name : "All Files";
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setUploading(true);

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        if (currentFolder !== "root") {
          formData.append("folderId", currentFolder);
        }

        const response = await fileAPI.uploadFile(formData, (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
        });
      }

      toast.success("Files uploaded successfully!");
      handleClose();
      onUploadSuccess(); // This will refetch fresh data from database
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    dispatch(closeUploadModal());
    setSelectedFiles([]);
    setUploadProgress({});
  };

  return (
    <AnimatePresence>
      {uploadModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass-dark rounded-2xl shadow-dark-xl max-w-2xl w-full max-h-[90vh] flex flex-col pointer-events-auto">
              {/* Header */}
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between p-6 border-b border-dark-border">
                  <h2 className="text-2xl font-bold text-dark-text-primary">
                    Upload Files
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-dark-text-secondary" />
                  </button>
                </div>
                {/* Destination folder info */}
                <div className="px-6 py-3 bg-accent-primary/10 border-b border-accent-primary/20 flex items-center gap-2">
                  <Folder className="w-4 h-4 text-accent-primary" />
                  <span className="text-sm text-dark-text-primary">
                    Uploading to:{" "}
                    <span className="font-semibold text-accent-primary">
                      {getCurrentFolderName()}
                    </span>
                  </span>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-dark-border rounded-xl p-12 text-center cursor-pointer hover:border-accent-primary hover:bg-accent-primary/5 transition-colors"
                >
                  <Upload className="w-12 h-12 text-dark-text-muted mx-auto mb-4" />
                  <p className="text-lg font-medium text-dark-text-primary mb-2">
                    Drop files here or click to browse
                  </p>
                  <p className="text-sm text-dark-text-secondary">
                    Support for any file type
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-dark-text-primary">
                      Selected Files ({selectedFiles.length})
                    </h3>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-dark-hover rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <File className="w-5 h-5 text-dark-text-muted flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-dark-text-primary truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-dark-text-muted">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>

                          {uploading &&
                            uploadProgress[file.name] !== undefined && (
                              <div className="flex items-center gap-2">
                                {uploadProgress[file.name] === 100 ? (
                                  <Check className="w-5 h-5 text-accent-success" />
                                ) : (
                                  <span className="text-sm font-medium text-accent-primary">
                                    {uploadProgress[file.name]}%
                                  </span>
                                )}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer - Always visible */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-6 border-t border-dark-border bg-dark-hover/50 flex-shrink-0">
                <button
                  onClick={handleClose}
                  disabled={uploading}
                  className="w-full sm:w-auto px-6 py-2 border border-dark-border rounded-lg font-medium text-dark-text-primary hover:bg-dark-card transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || selectedFiles.length === 0}
                  className="w-full sm:w-auto btn-primary px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Files
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;
