import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderPlus } from "lucide-react";
import toast from "react-hot-toast";
import { closeCreateFolderModal } from "../../store/slices/uiSlice";
import { fileAPI } from "../../services/file.service";

const CreateFolderModal = ({ onCreateSuccess }) => {
  const dispatch = useDispatch();
  const { createFolderModalOpen } = useSelector((state) => state.ui);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fileAPI.createFolder(data.folderName);
      toast.success("Folder created successfully!");
      handleClose();
      onCreateSuccess(); // This will refetch fresh data from database
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create folder");
    }
  };

  const handleClose = () => {
    dispatch(closeCreateFolderModal());
    reset();
  };

  return (
    <AnimatePresence>
      {createFolderModalOpen && (
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
                  <div className="w-10 h-10 bg-accent-warning/20 rounded-lg flex items-center justify-center">
                    <FolderPlus className="w-5 h-5 text-accent-warning" />
                  </div>
                  <h2 className="text-xl font-bold text-dark-text-primary">
                    Create New Folder
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-text-primary mb-2">
                      Folder Name
                    </label>
                    <input
                      {...register("folderName", {
                        required: "Folder name is required",
                        minLength: {
                          value: 1,
                          message: "Folder name must be at least 1 character",
                        },
                      })}
                      type="text"
                      placeholder="My Folder"
                      className="w-full px-4 py-3 input-dark rounded-lg outline-none"
                      autoFocus
                    />
                    {errors.folderName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-accent-error"
                      >
                        {errors.folderName.message}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-6 border-t border-dark-border bg-dark-hover/50">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:w-auto px-6 py-2 border border-dark-border rounded-lg font-medium text-dark-text-primary hover:bg-dark-card transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto btn-primary px-6 py-2 rounded-lg font-medium"
                  >
                    Create Folder
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateFolderModal;
