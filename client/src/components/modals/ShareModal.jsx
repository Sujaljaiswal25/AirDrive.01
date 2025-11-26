import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import { closeShareModal } from "../../store/slices/uiSlice";
import { fileAPI } from "../../services/file.service";

const ShareModal = () => {
  const dispatch = useDispatch();
  const { shareModalOpen, selectedFileForAction } = useSelector(
    (state) => state.ui
  );
  const [shareLink, setShareLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      setLoading(true);
      const response = await fileAPI.shareFile(selectedFileForAction._id);
      setShareLink(response.shareLink);
      toast.success("Share link generated!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate share link"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    dispatch(closeShareModal());
    setShareLink("");
    setCopied(false);
  };

  return (
    <AnimatePresence>
      {shareModalOpen && (
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
                  <div className="w-10 h-10 bg-accent-primary/20 rounded-lg flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-accent-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-dark-text-primary">
                    Share File
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
                <div>
                  <p className="text-sm text-dark-text-muted mb-2">
                    File name:
                  </p>
                  <p className="font-medium text-dark-text-primary">
                    {selectedFileForAction?.name}
                  </p>
                </div>

                {!shareLink ? (
                  <button
                    onClick={handleShare}
                    disabled={loading}
                    className="w-full btn-primary py-3 rounded-lg font-medium disabled:opacity-50"
                  >
                    {loading ? "Generating Link..." : "Generate Share Link"}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-dark-text-secondary">
                      Anyone with this link can view this file:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={shareLink}
                        readOnly
                        className="flex-1 px-4 py-2 bg-dark-hover border border-dark-border rounded-lg text-sm text-dark-text-primary"
                      />
                      <button
                        onClick={handleCopy}
                        className="px-4 py-2 bg-dark-hover hover:bg-dark-card border border-dark-border rounded-lg transition-colors"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-accent-success" />
                        ) : (
                          <Copy className="w-5 h-5 text-dark-text-secondary" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-dark-border bg-dark-hover/50">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 border border-dark-border rounded-lg font-medium text-dark-text-primary hover:bg-dark-card transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
