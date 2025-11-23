import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { closeDeleteModal } from "../../store/slices/uiSlice";
import { removeFile } from "../../store/slices/fileSlice";
import { fileAPI } from "../../services/file.service";
import { useState } from "react";

const DeleteModal = ({ onDeleteSuccess, isPermanent = false }) => {
  const dispatch = useDispatch();
  const { deleteModalOpen, selectedFileForAction } = useSelector(
    (state) => state.ui
  );
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      if (isPermanent) {
        await fileAPI.permanentDelete(selectedFileForAction._id);
        toast.success("File permanently deleted!");
      } else {
        await fileAPI.deleteFile(selectedFileForAction._id);
        toast.success("File deleted successfully!");
      }
      dispatch(removeFile(selectedFileForAction._id));
      handleClose();
      onDeleteSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete file");
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    dispatch(closeDeleteModal());
  };

  return (
    <AnimatePresence>
      {deleteModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Delete File
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-gray-700">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">
                    {selectedFileForAction?.name}
                  </span>
                  ?
                </p>
                <p className="text-sm text-red-600">
                  This action cannot be undone.
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleClose}
                  disabled={deleting}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-white transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
