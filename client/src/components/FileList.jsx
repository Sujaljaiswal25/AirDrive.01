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
import * as fileAPI from "../services/file.service";

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
      setIsStarred(response.data.file.isStarred);
      toast.success(
        response.data.file.isStarred
          ? "Added to starred"
          : "Removed from starred"
      );
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
      className="hover:bg-gray-50 cursor-pointer group"
      onClick={handleRowClick}
    >
      {/* Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {getFileIcon()}
          <span
            className="font-medium text-gray-900 truncate max-w-xs"
            title={file.name}
          >
            {file.name}
          </span>
        </div>
      </td>

      {/* Type */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {file.type === "folder" ? "Folder" : file.type?.split("/")[0] || "File"}
      </td>

      {/* Size */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {file.type === "folder" ? "-" : formatFileSize(file.size)}
      </td>

      {/* Modified */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {formatDate(file.createdAt)}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 relative">
        <div ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 hover:bg-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {currentFolder === "trash" ? (
                // Trash view: Show restore and permanent delete
                <>
                  <button
                    onClick={handleRestore}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Undo2 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Restore</span>
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
                          ? "fill-yellow-400 text-yellow-400"
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
      </td>
    </motion.tr>
  );
};

const FileList = ({ files, onUpdate }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Modified
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {files.map((file) => (
            <FileRow key={file._id} file={file} onUpdate={onUpdate} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;
