import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FileText,
  Image,
  Video,
  Music,
  File,
  Folder,
  Download,
  Share2,
  Trash2,
  Eye,
  MoreVertical,
  Star,
  Undo2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { formatFileSize } from "../utils/fileUtils";
import { formatDate } from "../utils/dateUtils";
import {
  openShareModal,
  openDeleteModal,
  openPreviewModal,
} from "../store/slices/uiSlice";
import { setCurrentFolder } from "../store/slices/fileSlice";
import toast from "react-hot-toast";
import { fileAPI } from "../services/file.service";

const FileRow = ({ file, onUpdate }) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [isStarred, setIsStarred] = useState(file.isStarred || false);
  const menuRef = useRef(null);
  const currentFolder = useSelector((state) => state.files.currentFolder);

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
      return <Folder className="w-5 h-5 text-yellow-500" />;
    if (file.type?.startsWith("image/"))
      return <Image className="w-5 h-5 text-green-500" />;
    if (file.type?.startsWith("video/"))
      return <Video className="w-5 h-5 text-purple-500" />;
    if (file.type?.startsWith("audio/"))
      return <Music className="w-5 h-5 text-pink-500" />;
    if (file.type?.includes("pdf") || file.type?.includes("document"))
      return <FileText className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const handleDownload = () => {
    window.open(file.url, "_blank");
    setShowMenu(false);
  };

  const handleStar = async (e) => {
    e.stopPropagation();
    try {
      const response = await fileAPI.toggleStar(file._id);
      setIsStarred(response.isStarred);
      toast.success(response.message);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to star file");
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
      toast.error(error.response?.data?.message || "Failed to restore file");
    }
    setShowMenu(false);
  };

  const handlePermanentDelete = (e) => {
    e.stopPropagation();
    dispatch(openDeleteModal(file));
    setShowMenu(false);
  };

  const handleRowClick = () => {
    if (file.type === "folder") {
      dispatch(setCurrentFolder(file._id));
    } else {
      dispatch(openPreviewModal(file));
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="hover:bg-dark-hover cursor-pointer group transition-colors"
      onClick={handleRowClick}
    >
      {/* Name */}
      <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
        <div className="flex items-center gap-2 md:gap-3">
          {getFileIcon()}
          <span
            className="font-medium text-dark-text-primary truncate max-w-[150px] md:max-w-xs"
            title={file.name}
          >
            {file.name}
          </span>
        </div>
      </td>

      {/* Type */}
      <td className="hidden md:table-cell px-3 md:px-4 lg:px-6 py-3 md:py-4 text-sm text-dark-text-secondary">
        {file.type === "folder" ? "Folder" : file.type?.split("/")[0] || "File"}
      </td>

      {/* Size */}
      <td className="hidden sm:table-cell px-3 md:px-4 lg:px-6 py-3 md:py-4 text-sm text-dark-text-secondary">
        {file.type === "folder" ? "-" : formatFileSize(file.size)}
      </td>

      {/* Modified */}
      <td className="hidden lg:table-cell px-3 md:px-4 lg:px-6 py-3 md:py-4 text-sm text-dark-text-secondary">
        {formatDate(file.createdAt)}
      </td>

      {/* Actions */}
      <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 relative text-right">
        <div ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 hover:bg-dark-card rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
          >
            <MoreVertical className="w-4 h-4 text-dark-text-secondary" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-dark-lg z-50 overflow-hidden">
              {currentFolder === "trash" ? (
                // Trash view: Show restore and permanent delete
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
                // Normal view: Show all regular actions
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
                    <span className="text-sm text-dark-text-primary">
                      Share
                    </span>
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
      </td>
    </motion.tr>
  );
};

const FileList = ({ files, onUpdate }) => {
  return (
    <div className="card-dark overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-dark-hover border-b border-dark-border">
            <tr>
              <th className="px-3 md:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-dark-text-secondary uppercase tracking-wider">
                Name
              </th>
              <th className="hidden md:table-cell px-3 md:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-dark-text-secondary uppercase tracking-wider">
                Type
              </th>
              <th className="hidden sm:table-cell px-3 md:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-dark-text-secondary uppercase tracking-wider">
                Size
              </th>
              <th className="hidden lg:table-cell px-3 md:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-dark-text-secondary uppercase tracking-wider">
                Modified
              </th>
              <th className="px-3 md:px-4 lg:px-6 py-3 text-right text-xs font-semibold text-dark-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {files.map((file) => (
              <FileRow key={file._id} file={file} onUpdate={onUpdate} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileList;
