import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FileText,
  Image,
  Video,
  Music,
  File,
  Folder,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Eye,
  Star,
  Undo2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { formatFileSize } from "../utils/fileUtils";
import { formatRelativeTime } from "../utils/dateUtils";
import { fileAPI } from "../services/file.service";
import toast from "react-hot-toast";
import {
  openShareModal,
  openDeleteModal,
  openPreviewModal,
} from "../store/slices/uiSlice";
import { setCurrentFolder } from "../store/slices/fileSlice";

const FileCard = ({ file, onUpdate }) => {
  const dispatch = useDispatch();
  const { currentFolder } = useSelector((state) => state.files);
  const [showMenu, setShowMenu] = useState(false);
  const [isStarred, setIsStarred] = useState(file.isStarred || false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const getFileIcon = () => {
    if (file.type === "folder")
      return <Folder className="w-8 h-8 text-yellow-500" />;
    if (file.type?.startsWith("image/"))
      return <Image className="w-8 h-8 text-green-500" />;
    if (file.type?.startsWith("video/"))
      return <Video className="w-8 h-8 text-purple-500" />;
    if (file.type?.startsWith("audio/"))
      return <Music className="w-8 h-8 text-pink-500" />;
    if (file.type?.includes("pdf") || file.type?.includes("document"))
      return <FileText className="w-8 h-8 text-blue-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const handleDownload = () => {
    window.open(file.url, "_blank");
    setShowMenu(false);
  };

  const handleCardClick = () => {
    if (file.type === "folder") {
      dispatch(setCurrentFolder(file._id));
    } else {
      dispatch(openPreviewModal(file));
    }
  };

  const handleStar = async (e) => {
    e.stopPropagation();
    try {
      const response = await fileAPI.toggleStar(file._id);
      setIsStarred(response.isStarred);
      toast.success(response.message);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to update star status");
    }
    setShowMenu(false);
  };

  const handleTrash = async (e) => {
    e.stopPropagation();
    try {
      await fileAPI.moveToTrash(file._id);
      toast.success("Moved to trash");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Move to trash error:", error);
      toast.error(error.response?.data?.message || "Failed to move to trash");
    }
    setShowMenu(false);
  };

  const handleRestore = async (e) => {
    e.stopPropagation();
    try {
      await fileAPI.restoreFromTrash(file._id);
      toast.success("Restored from trash");
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to restore");
    }
    setShowMenu(false);
  };

  const handlePermanentDelete = (e) => {
    e.stopPropagation();
    dispatch(openDeleteModal(file));
    setShowMenu(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Thumbnail or Icon */}
      <div className="aspect-square rounded-lg bg-gray-50 flex items-center justify-center mb-3 overflow-hidden">
        {file.type?.startsWith("image/") ? (
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          getFileIcon()
        )}
      </div>

      {/* File Info */}
      <div className="space-y-1">
        <h3 className="font-medium text-gray-900 truncate" title={file.name}>
          {file.name}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {file.type === "folder" ? "Folder" : formatFileSize(file.size)}
          </span>
          <span>{formatRelativeTime(file.createdAt)}</span>
        </div>
      </div>

      {/* Actions Menu */}
      <div
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        ref={menuRef}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
        >
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {currentFolder === "trash" ? (
              // Trash view actions
              <>
                <button
                  onClick={handleRestore}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  <Undo2 className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600">Restore</span>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={handlePermanentDelete}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-left"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">Delete Forever</span>
                </button>
              </>
            ) : (
              // Normal view actions
              <>
                {file.type !== "folder" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(openPreviewModal(file));
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Preview</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Download</span>
                    </button>
                  </>
                )}
                <button
                  onClick={handleStar}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  <Star
                    className={`w-4 h-4 ${
                      isStarred
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-600"
                    }`}
                  />
                  <span className="text-sm text-gray-700">
                    {isStarred ? "Unstar" : "Star"}
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(openShareModal(file));
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  <Share2 className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Share</span>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={handleTrash}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-left"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">Move to Trash</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const FileGrid = ({ files, onUpdate }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {files.map((file) => (
        <FileCard key={file._id} file={file} onUpdate={onUpdate} />
      ))}
    </div>
  );
};

export default FileGrid;
