import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderPlus } from "lucide-react";
import toast from "react-hot-toast";
import { closeCreateFolderModal } from "../../store/slices/uiSlice";
import { addFile } from "../../store/slices/fileSlice";
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
      dispatch(addFile(response.folder));
      toast.success("Folder created successfully!");
      handleClose();
      onCreateSuccess();
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
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FolderPlus className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Create New Folder
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      autoFocus
                    />
                    {errors.folderName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.folderName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
