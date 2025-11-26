import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { closeDeleteModal } from "../../store/slices/uiSlice";
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
        await fileAPI.moveToTrash(selectedFileForAction._id);
        toast.success("Moved to trash!");
      }
      handleClose();
      onDeleteSuccess(); // This will refetch from database
    } catch (error) {
      console.error("Delete error:", error);
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-dark rounded-2xl shadow-dark-xl max-w-md w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-dark-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-error/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-accent-error" />
                  </div>
                  <h2 className="text-xl font-bold text-dark-text-primary">
                    {isPermanent ? "Delete Permanently" : "Delete File"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-dark-text-secondary" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-dark-text-primary">
                  Are you sure you want to{" "}
                  {isPermanent ? "permanently delete" : "delete"}{" "}
                  <span className="font-semibold text-accent-primary">
                    {selectedFileForAction?.name}
                  </span>
                  ?
                </p>
                <p className="text-sm text-accent-error bg-accent-error/10 p-3 rounded-lg">
                  {isPermanent
                    ? "This action cannot be undone. The file will be permanently deleted."
                    : "This file will be moved to trash."}
                </p>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-6 border-t border-dark-border bg-dark-hover/50">
                <button
                  onClick={handleClose}
                  disabled={deleting}
                  className="w-full sm:w-auto px-6 py-2 border border-dark-border rounded-lg font-medium text-dark-text-primary hover:bg-dark-card transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full sm:w-auto px-6 py-2 bg-accent-error text-white rounded-lg font-medium hover:bg-accent-error/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting
                    ? "Deleting..."
                    : isPermanent
                    ? "Delete Forever"
                    : "Delete"}
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
