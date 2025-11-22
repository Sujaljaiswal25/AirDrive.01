import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2 } from "lucide-react";
import { closePreviewModal, openShareModal } from "../../store/slices/uiSlice";
import { formatFileSize } from "../../utils/fileUtils";
import { formatDate } from "../../utils/dateUtils";

const PreviewModal = () => {
  const dispatch = useDispatch();
  const { previewModalOpen, selectedFileForAction } = useSelector(
    (state) => state.ui
  );

  const handleClose = () => {
    dispatch(closePreviewModal());
  };

  const handleDownload = () => {
    window.open(selectedFileForAction?.url, "_blank");
  };

  const handleShare = () => {
    dispatch(closePreviewModal());
    dispatch(openShareModal(selectedFileForAction));
  };

  const renderPreview = () => {
    if (!selectedFileForAction) return null;

    const { type, url, name } = selectedFileForAction;

    if (type?.startsWith("image/")) {
      return (
        <img
          src={url}
          alt={name}
          className="max-w-full max-h-[60vh] object-contain mx-auto rounded-lg"
        />
      );
    }

    if (type?.startsWith("video/")) {
      return (
        <video
          src={url}
          controls
          className="max-w-full max-h-[60vh] mx-auto rounded-lg"
        />
      );
    }

    if (type?.startsWith("audio/")) {
      return <audio src={url} controls className="w-full" />;
    }

    if (type?.includes("pdf")) {
      return (
        <iframe src={url} className="w-full h-[60vh] rounded-lg" title={name} />
      );
    }

    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          Preview not available for this file type
        </p>
        <button
          onClick={handleDownload}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Download to View
        </button>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {previewModalOpen && selectedFileForAction && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-90 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex flex-col p-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white truncate">
                  {selectedFileForAction.name}
                </h2>
                <p className="text-sm text-gray-300">
                  {formatFileSize(selectedFileForAction.size)} •{" "}
                  {formatDate(selectedFileForAction.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={handleShare}
                  className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 flex items-center justify-center overflow-auto">
              {renderPreview()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PreviewModal;
