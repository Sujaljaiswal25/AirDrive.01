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
      return {
        icon: (
          <Folder className="w-8 h-8 sm:w-10 sm:h-10 text-accent-warning" />
        ),
        label: "Folder",
        color: "bg-accent-warning/10",
      };
    if (file.type?.startsWith("image/"))
      return {
        icon: <Image className="w-8 h-8 sm:w-10 sm:h-10 text-accent-success" />,
        label: "Image",
        color: "bg-accent-success/10",
      };
    if (file.type?.startsWith("video/"))
      return {
        icon: <Video className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />,
        label: "Video",
        color: "bg-purple-500/10",
      };
    if (file.type?.startsWith("audio/"))
      return {
        icon: <Music className="w-8 h-8 sm:w-10 sm:h-10 text-pink-500" />,
        label: "Audio",
        color: "bg-pink-500/10",
      };
    if (file.type?.includes("pdf") || file.type?.includes("document"))
      return {
        icon: <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />,
        label: "Document",
        color: "bg-blue-500/10",
      };
    return {
      icon: <File className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" />,
      label: "File",
      color: "bg-gray-500/10",
    };
  };

  const fileIcon = getFileIcon();

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
      className="group relative bg-dark-card hover:bg-dark-hover border border-dark-border hover:border-accent-primary/30 rounded-xl p-2 sm:p-3 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-accent-primary/5"
      onClick={handleCardClick}
    >
      {/* Star Badge */}
      {isStarred && (
        <div className="absolute top-2 left-2 z-10">
          <Star className="w-4 h-4 fill-accent-warning text-accent-warning" />
        </div>
      )}

      {/* Thumbnail or Icon */}
      <div
        className={`aspect-[4/3] sm:aspect-square rounded-lg ${fileIcon.color} flex items-center justify-center mb-2 sm:mb-3 overflow-hidden border border-dark-border/50`}
      >
        {file.type?.startsWith("image/") ? (
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            {fileIcon.icon}
            <span className="text-xs font-medium text-dark-text-muted">
              {fileIcon.label}
            </span>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="space-y-1">
        <h3
          className="text-xs sm:text-sm font-medium text-dark-text-primary truncate leading-snug"
          title={file.name}
        >
          {file.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-dark-text-muted">
          {file.type !== "folder" && (
            <span className="px-2 py-0.5 bg-dark-hover rounded text-xs font-medium">
              {formatFileSize(file.size)}
            </span>
          )}
          <span className="text-xs">{formatRelativeTime(file.createdAt)}</span>
        </div>
      </div>

      {/* Quick Actions - Always visible on mobile, hover on desktop */}
      <div className="flex items-center gap-1 mt-2 sm:mt-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {file.type !== "folder" && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(openPreviewModal(file));
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-1.5 py-1 sm:px-2 sm:py-1.5 bg-dark-hover hover:bg-accent-primary/10 hover:text-accent-primary rounded-lg transition-colors text-xs font-medium"
              title="Preview"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-1.5 py-1 sm:px-2 sm:py-1.5 bg-dark-hover hover:bg-accent-success/10 hover:text-accent-success rounded-lg transition-colors text-xs font-medium"
              title="Download"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Get</span>
            </button>
          </>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(openShareModal(file));
          }}
          className="flex-1 flex items-center justify-center gap-1.5 px-1.5 py-1 sm:px-2 sm:py-1.5 bg-dark-hover hover:bg-accent-primary/10 hover:text-accent-primary rounded-lg transition-colors text-xs font-medium"
          title="Share"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>
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
          className="p-2 bg-dark-card rounded-lg shadow-dark-md hover:bg-dark-hover border border-dark-border"
        >
          <MoreVertical className="w-4 h-4 text-dark-text-secondary" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-dark-lg z-10 overflow-hidden">
            {currentFolder === "trash" ? (
              // Trash view actions
              <>
                <button
                  onClick={handleRestore}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-hover transition-colors text-left"
                >
                  <Undo2 className="w-4 h-4 text-accent-primary" />
                  <span className="text-sm text-accent-primary">Restore</span>
                </button>
                <div className="border-t border-dark-border"></div>
                <button
                  onClick={handlePermanentDelete}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent-error/10 transition-colors text-left"
                >
                  <Trash2 className="w-4 h-4 text-accent-error" />
                  <span className="text-sm text-accent-error">
                    Delete Forever
                  </span>
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
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-hover transition-colors text-left"
                    >
                      <Eye className="w-4 h-4 text-dark-text-secondary" />
                      <span className="text-sm text-dark-text-primary">
                        Preview
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-hover transition-colors text-left"
                    >
                      <Download className="w-4 h-4 text-dark-text-secondary" />
                      <span className="text-sm text-dark-text-primary">
                        Download
                      </span>
                    </button>
                  </>
                )}
                <button
                  onClick={handleStar}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-hover transition-colors text-left"
                >
                  <Star
                    className={`w-4 h-4 ${
                      isStarred
                        ? "fill-accent-warning text-accent-warning"
                        : "text-dark-text-secondary"
                    }`}
                  />
                  <span className="text-sm text-dark-text-primary">
                    {isStarred ? "Unstar" : "Star"}
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(openShareModal(file));
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-hover transition-colors text-left"
                >
                  <Share2 className="w-4 h-4 text-dark-text-secondary" />
                  <span className="text-sm text-dark-text-primary">Share</span>
                </button>
                <div className="border-t border-dark-border"></div>
                <button
                  onClick={handleTrash}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent-error/10 transition-colors text-left"
                >
                  <Trash2 className="w-4 h-4 text-accent-error" />
                  <span className="text-sm text-accent-error">
                    Move to Trash
                  </span>
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
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2 sm:gap-4 lg:gap-6">
      {files.map((file) => (
        <FileCard key={file._id} file={file} onUpdate={onUpdate} />
      ))}
    </div>
  );
};

export default FileGrid;
